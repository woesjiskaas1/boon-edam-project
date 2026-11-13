<?php
/**
 * Connect MySQL with PDO class
 */
class db {
  
  private $dbhost = 'localhost';
  private $dbuser = 'root';
  private $dbpass = '';
  private $dbname = 'test_db';

  public function connect() {
    $options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
    $server = new PDO(
      "mysql:host=$this->dbhost;charset=utf8mb4",
      $this->dbuser,
      $this->dbpass,
      $options
    );
    $database = str_replace('`', '``', $this->dbname);
    $server->exec("CREATE DATABASE IF NOT EXISTS `$database`");

    $dbConn = new PDO(
      "mysql:host=$this->dbhost;dbname=$this->dbname;charset=utf8mb4",
      $this->dbuser,
      $this->dbpass,
      $options
    );
    $schema = file_get_contents(__DIR__ . '/database.sql');
    if ($schema === false) {
      throw new RuntimeException('Could not read database.sql');
    }
    $seedStatements = [];
    foreach (array_filter(array_map('trim', explode(';', $schema))) as $statement) {
      if (stripos($statement, 'INSERT') === 0) {
        $seedStatements[] = $statement;
        continue;
      }

      $dbConn->exec($statement);
    }

    $employeeColumns = $dbConn->query('SHOW COLUMNS FROM employee')->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('adress', $employeeColumns, true)) {
      $dbConn->exec('ALTER TABLE employee ADD adress VARCHAR(255) NULL');
    }
    if (!in_array('middle_name', $employeeColumns, true)) {
      $dbConn->exec('ALTER TABLE employee ADD middle_name VARCHAR(50) NULL');
    }
    if (!in_array('phone', $employeeColumns, true)) {
      if (in_array('phone_number', $employeeColumns, true)) {
        $dbConn->exec('ALTER TABLE employee CHANGE phone_number phone VARCHAR(20) NULL');
      } elseif (in_array('phoner', $employeeColumns, true)) {
        $dbConn->exec('ALTER TABLE employee CHANGE phoner phone VARCHAR(20) NULL');
      } else {
        $dbConn->exec('ALTER TABLE employee ADD phone VARCHAR(20) NULL');
      }
    }

    $employeeCount = (int) $dbConn->query('SELECT COUNT(*) FROM employee')->fetchColumn();
    if ($employeeCount === 0) {
      foreach ($seedStatements as $statement) {
        $dbConn->exec($statement);
      }
    }

    $jobRoleSeed = file_get_contents(__DIR__ . '/job-role-seed.sql');
    if ($jobRoleSeed === false) {
      throw new RuntimeException('Could not read job-role-seed.sql');
    }
    $jobRoleCount = (int) $dbConn->query('SELECT COUNT(*) FROM job_role')->fetchColumn();
    if ($jobRoleCount === 0) {
      foreach (array_filter(array_map('trim', explode(';', $jobRoleSeed))) as $statement) {
        $dbConn->exec($statement);
      }
    }

    return $dbConn;
  }
}