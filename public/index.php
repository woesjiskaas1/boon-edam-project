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
     $response->getBody()->write(json_encode(['msg' => '"Page not found']));
    return $response; 
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