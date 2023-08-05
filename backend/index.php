<?php
   use Psr\Http\Message\ResponseInterface as Response;
   use Psr\Http\Message\ServerRequestInterface as Request;
   use Slim\Factory\AppFactory;

   require __DIR__ . '/../vendor/autoload.php';

   $app = AppFactory::create();
   $app->setBasePath('/to-doList/backend/index.php');
   $app->addRoutingMiddleware();
   $errorMiddleware = $app->addErrorMiddleware(true, true, true);

   $mysqli = new mysqli("localhost", "root", "", "test");

    
   function getTodos()
   {
      global $mysqli;
      $todos = array();

      $result = $mysqli->query("SELECT id,name,status,created_at,updated_at FROM todo_master"); //returns an object
      while ($row=$result->fetch_assoc())
         array_push($todos,$row);

      return $todos;
   }

   function insertTodo($name)
   {
      global $mysqli ;
      $timestamp = date('Y-m-d H:i:s');
      $mysqli->query("INSERT INTO todo_master (name,status,created_at,updated_at) VALUES ('$name',0,'$timestamp','$timestamp')");
   }


   function deleteTodo($id)
   {
      global $mysqli;
      $mysqli->query("DELETE FROM todo_master where id = '$id'");
   }


   function updateTodo($id,$name)
   {
      global $mysqli;
      $timestamp = date('Y-m-d H:i:s');
      $mysqli->query("UPDATE todo_master SET name = '$name',updated_at = '$timestamp' WHERE id = '$id'");
   }

   function updateStatus($id,$status)
   {
      global $mysqli;
      $timestamp = date('Y-m-d H:i:s');
      $mysqli->query("UPDATE todo_master SET status = '$status',updated_at = '$timestamp' WHERE id = '$id'");
   }

   $app->get('/', function (Request $request, Response $response, $args) {
      $response->getBody()->write(json_encode(getTodos()));
      return $response->withHeader('Access-Control-Allow-Origin','*');
   });



   $app->get('/todo/insert/{name}', function (Request $request, Response $response,$args) {

      // A way to retrieve the request body data
      // $data = json_decode($request->getBody(), true);
      // $name = $request->getQueryParams()['name'];

      insertTodo($args['name']);
      
      //$timestamp = date('Y-m-d H:i:s');
         
      // Create the new todo
      // $newTodo = ['id' => $id, 'name' => $data[$name], 'created_at'=> $timestamp, 'updated_at' => $timestamp];

      // Return the newly created todo as a JSON response
      $response->getBody()->write(json_encode(getTodos()));
      return $response->withHeader('Access-Control-Allow-Origin','*');;
   });

   $app->get('/todo/delete/{id}', function (Request $request, Response $response, $args)
   {
      $todos = getTodos();
      // Find the index of the todo with the given ID
      // $id = $request->getQueryParams()['id'];
      $flag = 0;
      // print_r($todos);
      foreach($todos as $key=>$value){
         if($value['id'] == $args['id']){
            $flag = 1;
            deleteTodo($args['id']);
            $response->getBody()->write(json_encode(getTodos()));
         }
      }
      
      if ($flag != 0) {
         // Return a success status message as a JSON response
         // $response->getBody()->write(json_encode(['message' => 'Todo deleted successfully']));
         return $response->withHeader('Access-Control-Allow-Origin','*');
      } 
      else {
         // $response->getBody()->write(json_encode(['message' => 'Todo not found']));
         return $response->withHeader('Access-Control-Allow-Origin','*');
      }
   });

   $app->get('/todo/update/{id}/{name}', function (Request $request, Response $response,$args)
   {
      // $id = $request->getQueryParams()['id'];
      // $name = $request->getQueryParams()['name'];

      updateTodo($args['id'],$args['name']);

      $response->getBody()->write((string)json_encode(getTodos()));
      return $response->withHeader('Access-Control-Allow-Origin','*');
   });

   $app->get('/todo/updateStat/{status}/{id}', function (Request $request, Response $response,$args)
   {
      updateStatus($args['id'],$args['status']);

      $response->getBody()->write((string)json_encode(getTodos()));
      return $response->withHeader('Access-Control-Allow-Origin','*');
   });

   $app->run();
?>
