<?php
// # use Namespaces for HTTP request
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;

// # include the Slim framework
require_once __DIR__ . '/../vendor/autoload.php';

// # include DB connection file
require_once __DIR__ . '/../src/config/db.php';

try {

$app = AppFactory::create();
$app->addBodyParsingMiddleware();

$jsonResponse = static function (Response $response, $data, int $status = 200) {
    $json = json_encode($data);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response->withStatus($status);
};

$requestBody = static function (Request $request) {
    $body = $request->getParsedBody();
    if (is_object($body)) {
        $body = get_object_vars($body);
    }
    if (is_array($body)) {
        return $body;
    }

    $decoded = json_decode((string) $request->getBody(), true);
    return is_array($decoded) ? $decoded : null;
};

$getEmployeeSkills = static function (PDO $connection, int $employeeId) {
    $query = $connection->prepare(
        'SELECT s.skill_id, s.name
         FROM employee_skill es
         JOIN skill s ON s.skill_id = es.skill_id
         WHERE es.employee_id = ?
         ORDER BY s.name'
    );
    $query->execute([$employeeId]);
    return $query->fetchAll(PDO::FETCH_ASSOC);
};


// Show the test page at /public/.
$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write(json_encode(['name' => "unknown"]));
    return $response;
});

//ENDPOINT NAME
// ---------------------------------------------------------------------

$app->get('/name/{userInput}', function (Request $request, Response $response, $args) {
    $userName = $args['userInput'];
    $response->getBody()->write(json_encode(['name' => $userName]));
    return $response;
});

// ---------------------------------------------------------------------

$app->get('/employee-job-roles', function (Request $request, Response $response) use ($jsonResponse) {
    $rows = (new db())->connect()->query(
        'SELECT er.employee_id, er.job_role_id, r.name
         FROM employee_job_role er
         JOIN job_role r ON r.job_role_id = er.job_role_id
         ORDER BY er.employee_id, r.name'
    )->fetchAll(PDO::FETCH_ASSOC);

    return $jsonResponse($response, $rows);
});

$app->get('/job-roles', function (Request $request, Response $response) use ($jsonResponse) {
    $connection = (new db())->connect();
    $roles = $connection->query(
        'SELECT job_role_id, name, description
         FROM job_role
         WHERE is_active = TRUE
         ORDER BY name'
    )->fetchAll(PDO::FETCH_ASSOC);
    $skillsQuery = $connection->prepare(
        'SELECT s.skill_id, s.name
         FROM job_role_skill rs
         JOIN skill s ON s.skill_id = rs.skill_id
         WHERE rs.job_role_id = ?
         ORDER BY s.name'
    );

    foreach ($roles as &$role) {
        $skillsQuery->execute([$role['job_role_id']]);
        $role['skills'] = $skillsQuery->fetchAll(PDO::FETCH_ASSOC);
    }
    unset($role);

    return $jsonResponse($response, $roles);
});

$app->get('/skills', function (Request $request, Response $response) use ($jsonResponse) {
    $skills = (new db())->connect()->query(
        'SELECT skill_id, name FROM skill ORDER BY name'
    )->fetchAll(PDO::FETCH_ASSOC);

    return $jsonResponse($response, $skills);
});


//ENDPOINT FIRST NAME ALL
// ---------------------------------------------------------------------

$app->get('/first-names', function (Request $request, Response $response) {
    $names = (new db())->connect()
        ->query('SELECT first_name FROM employee')
        ->fetchAll(PDO::FETCH_COLUMN);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});

// ---------------------------------------------------------------------

//ENDPOINT ALL EMPLOYEE INFO
// ---------------------------------------------------------------------
$app->get('/employees', function (Request $request, Response $response) {
    $names = (new db())->connect()
        ->query('SELECT * FROM employee')
        ->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

$app->post('/employees', function (Request $request, Response $response) use ($jsonResponse, $requestBody) {
    $body = $requestBody($request);
    if (!is_array($body)) {
        return $jsonResponse($response, ['error' => 'A JSON request body is required.'], 400);
    }

    $firstName = trim((string) ($body['first_name'] ?? ''));
    $middleName = trim((string) ($body['middle_name'] ?? ''));
    $lastName = trim((string) ($body['last_name'] ?? ''));
    $email = trim((string) ($body['email'] ?? ''));
    $country = trim((string) ($body['country'] ?? ''));
    $location = trim((string) ($body['location'] ?? ''));

    if ($firstName === '' || $lastName === '' || $country === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return $jsonResponse($response, ['error' => 'Valid first name, last name, email, and country are required.'], 400);
    }

    $connection = (new db())->connect();
    $connection->beginTransaction();
    try {
        $temporaryNumber = 'NEW-' . bin2hex(random_bytes(16));
        $insert = $connection->prepare(
            'INSERT INTO employee (employee_number, first_name, middle_name, last_name, email, country, location)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $insert->execute([
            $temporaryNumber,
            $firstName,
            $middleName === '' ? null : $middleName,
            $lastName,
            $email,
            $country,
            $location === '' ? null : $location,
        ]);

        $employeeId = (int) $connection->lastInsertId();
        $employeeNumber = 'EMP' . str_pad((string) $employeeId, 3, '0', STR_PAD_LEFT);
        $update = $connection->prepare(
            'UPDATE employee SET employee_number = ? WHERE employee_id = ?'
        );
        $update->execute([$employeeNumber, $employeeId]);

        $select = $connection->prepare('SELECT * FROM employee WHERE employee_id = ?');
        $select->execute([$employeeId]);
        $employee = $select->fetch(PDO::FETCH_ASSOC);
        $connection->commit();

        return $jsonResponse($response, $employee, 201);
    } catch (Throwable $error) {
        if ($connection->inTransaction()) {
            $connection->rollBack();
        }
        throw $error;
    }
});

$app->post('/employees/{id:\d+}/job-roles', function (Request $request, Response $response, $args) use ($jsonResponse, $requestBody, $getEmployeeSkills) {
    $body = $requestBody($request);
    $roleId = is_array($body) ? filter_var($body['job_role_id'] ?? null, FILTER_VALIDATE_INT) : false;
    if ($roleId === false || $roleId < 1) {
        return $jsonResponse($response, ['error' => 'A valid job_role_id is required.'], 400);
    }

    $connection = (new db())->connect();
    $employeeId = (int) $args['id'];
    $exists = $connection->prepare(
        'SELECT
            (SELECT COUNT(*) FROM employee WHERE employee_id = ?) AS employee_exists,
            (SELECT COUNT(*) FROM job_role WHERE job_role_id = ? AND is_active = TRUE) AS role_exists'
    );
    $exists->execute([$employeeId, $roleId]);
    $result = $exists->fetch(PDO::FETCH_ASSOC);
    if ((int) $result['employee_exists'] === 0 || (int) $result['role_exists'] === 0) {
        return $jsonResponse($response, ['error' => 'Employee or active job role not found.'], 404);
    }

    $connection->beginTransaction();
    try {
        $link = $connection->prepare(
            'INSERT IGNORE INTO employee_job_role (employee_id, job_role_id, assigned_date)
             VALUES (?, ?, CURRENT_DATE)'
        );
        $link->execute([$employeeId, $roleId]);

        $copySkills = $connection->prepare(
            "INSERT IGNORE INTO employee_skill
                (employee_id, skill_id, skill_level, origin, assigned_date)
             SELECT ?, skill_id, 1, 'ROLE', CURRENT_DATE
             FROM job_role_skill
             WHERE job_role_id = ?"
        );
        $copySkills->execute([$employeeId, $roleId]);
        $connection->commit();
    } catch (Throwable $error) {
        if ($connection->inTransaction()) {
            $connection->rollBack();
        }
        throw $error;
    }

    return $jsonResponse($response, $getEmployeeSkills($connection, $employeeId));
});

$app->post('/employees/{id:\d+}/skills', function (Request $request, Response $response, $args) use ($jsonResponse, $requestBody, $getEmployeeSkills) {
    $body = $requestBody($request);
    $skillId = is_array($body) ? filter_var($body['skill_id'] ?? null, FILTER_VALIDATE_INT) : false;
    if ($skillId === false || $skillId < 1) {
        return $jsonResponse($response, ['error' => 'A valid skill_id is required.'], 400);
    }

    $connection = (new db())->connect();
    $employeeId = (int) $args['id'];
    $exists = $connection->prepare(
        'SELECT
            (SELECT COUNT(*) FROM employee WHERE employee_id = ?) AS employee_exists,
            (SELECT COUNT(*) FROM skill WHERE skill_id = ?) AS skill_exists'
    );
    $exists->execute([$employeeId, $skillId]);
    $result = $exists->fetch(PDO::FETCH_ASSOC);
    if ((int) $result['employee_exists'] === 0 || (int) $result['skill_exists'] === 0) {
        return $jsonResponse($response, ['error' => 'Employee or skill not found.'], 404);
    }

    $insert = $connection->prepare(
        "INSERT IGNORE INTO employee_skill
            (employee_id, skill_id, skill_level, origin, assigned_date)
         VALUES (?, ?, 1, 'MANUAL', CURRENT_DATE)"
    );
    $insert->execute([$employeeId, $skillId]);

    return $jsonResponse($response, $getEmployeeSkills($connection, $employeeId));
});

$app->delete('/employees/{id:\d+}/skills/{skillId:\d+}', function (Request $request, Response $response, $args) use ($jsonResponse) {
    $connection = (new db())->connect();
    $delete = $connection->prepare(
        'DELETE FROM employee_skill WHERE employee_id = ? AND skill_id = ?'
    );
    $delete->execute([(int) $args['id'], (int) $args['skillId']]);

    return $jsonResponse($response, ['deleted' => $delete->rowCount() > 0]);
});

//ENDPOINT ONE EMPLOYEE ALL INFO
// ---------------------------------------------------------------------
$app->get('/employees/{id:\d+}', function (Request $request, Response $response,$args = []) {
    $query = (new db())->connect()->prepare('SELECT * FROM employee WHERE employee_id = ?');
    $query->execute([$args['id']]);
    $names = $query->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

//ENDPOINT ALL CERTIFICATE INFO
// ---------------------------------------------------------------------
$app->get('/certificates', function (Request $request, Response $response) {
    $names = (new db())->connect()
        ->query('SELECT * FROM certificate_type')
        ->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

//ENDPOINT CERTIFICATE INFO
// ---------------------------------------------------------------------
$app->get('/certificates/{name}', function (Request $request, Response $response, $args) {
    $query = (new db())->connect()->prepare('SELECT * FROM certificate_type WHERE name = ?');
    $query->execute([$args['name']]);
    $names = $query->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

//ENDPOINT ALL EMPLOYEE CERTIFICATE INFO
// ---------------------------------------------------------------------
$app->get('/employee_certificates', function (Request $request, Response $response) {
    $names = (new db())->connect()
        ->query('SELECT * FROM employee_certificate')
        ->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

//ENDPOINT SPECIFIC EMPLOYEE CERTIFICATE INFO
// ---------------------------------------------------------------------
$app->get('/employee_certificates/{id:\d+}', function (Request $request, Response $response,$args = []) {
    $query = (new db())->connect()->prepare('SELECT * FROM employee_certificate WHERE employee_id = ?');
    $query->execute([$args['id']]);
    $names = $query->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

//ENDPOINT ALL EMPLOYEE TRAINING INFO
// ---------------------------------------------------------------------
$app->get('/employee_training', function (Request $request, Response $response) {
    $names = (new db())->connect()
        ->query('SELECT * FROM training')
        ->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

//ENDPOINT SPECIFIC EMPLOYEE TRAINING INFO
// ---------------------------------------------------------------------
$app->get('/employee_training/{id:\d+}', function (Request $request, Response $response,$args = []) {
    $query = (new db())->connect()->prepare('SELECT * FROM training WHERE employee_id = ?');
    $query->execute([$args['id']]);
    $names = $query->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

//ENDPOINT ALL EMPLOYEE SKILL INFO
// ---------------------------------------------------------------------
$app->get('/employee_skills', function (Request $request, Response $response) {
    $names = (new db())->connect()
        ->query('SELECT * FROM employee_skill')
        ->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

//ENDPOINT SPECIFIC EMPLOYEE SKILL INFO
// ---------------------------------------------------------------------
$app->get('/employee_skills/{id:\d+}', function (Request $request, Response $response,$args = []) {
    $query = (new db())->connect()->prepare('SELECT * FROM employee_skill WHERE employee_id = ?');
    $query->execute([$args['id']]);
    $names = $query->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

//ENDPOINT ALL EMPLOYEE FILE INFO
// ---------------------------------------------------------------------
$app->get('/employee_files', function (Request $request, Response $response) {
    $names = (new db())->connect()
        ->query('SELECT * FROM `file`')
        ->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

//ENDPOINT SPECIFIC EMPLOYEE FILE INFO
// ---------------------------------------------------------------------
$app->get('/employee_files/{id:\d+}', function (Request $request, Response $response,$args = []) {
    $query = (new db())->connect()->prepare('SELECT * FROM `file` WHERE employee_id = ?');
    $query->execute([$args['id']]);
    $names = $query->fetchAll(PDO::FETCH_ASSOC);

    $json = json_encode($names);
    if ($json === false) {
        throw new RuntimeException(json_last_error_msg());
    }

    $response->getBody()->write($json);
    return $response;
});
// ---------------------------------------------------------------------

$app->get('/{routes:.+}', function ($request, $response) {
    $response->getBody()->write(json_encode(['error' => 'Not found']));
    return $response->withStatus(404);
});



$app->add(function (Request $request, RequestHandler $handler) {
    $response = $handler->handle($request);
    return $response->withHeader('Content-Type', 'application/json');
});



$app->run();

//voor json cache

} catch (\Throwable $e) {
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    Echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTrace()
        ]);
}