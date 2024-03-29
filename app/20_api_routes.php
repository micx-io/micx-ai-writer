<?php
namespace App;



use App\Ctrl\AutoCompleteCtrl;
use App\Ctrl\ContextCtrl;
use App\Ctrl\ElementsCtrl;
use App\Ctrl\FileCtrl;
use App\Ctrl\GalleryCtrl;
use App\Ctrl\GliederungCtrl;
use App\Ctrl\InfoCtrl;
use App\Ctrl\PresetCtrl;
use App\Ctrl\ProjectCtrl;
use App\Ctrl\PropertiesCtrl;
use App\Ctrl\RepoCtrl;
use App\Ctrl\UploadCtrl;
use Brace\Auth\Basic\AuthBasicMiddleware;
use Brace\Auth\Basic\RequireValidAuthTokenMiddleware;
use Brace\Core\AppLoader;
use Brace\Core\BraceApp;
use Phore\VCS\VcsFactory;


AppLoader::extend(function (BraceApp $app) {

    $mount = CONF_API_MOUNT;

    // Controller classes

    // Autoload Controller Classes and routes from directory
    $app->router->autoload($mount, __DIR__ . "/../src/Ctrl/*.php");

    /*
    $app->router->registerClass($mount, InfoCtrl::class, [RequireValidAuthTokenMiddleware::class]);
    $app->router->registerClass($mount, GliederungCtrl::class, [RequireValidAuthTokenMiddleware::class]);
    $app->router->registerClass($mount, AutoCompleteCtrl::class, [RequireValidAuthTokenMiddleware::class]);
    $app->router->registerClass($mount, PresetCtrl::class, [RequireValidAuthTokenMiddleware::class]);
    $app->router->registerClass($mount, ContextCtrl::class, [RequireValidAuthTokenMiddleware::class]);
    */


    // Other stuff
    //$app->router->on("POST|GET@$mount/repo", RepoCtrl::class, [RequireValidAuthTokenMiddleware::class]);

    // Return the Api Version
    $app->router->on("GET@$mount", function() {
        return ["system" => "ai-writer working", "status" => "ok"];
    });

    // Redirect to static Middleware (Frontend)
    $app->router->on("GET@/", function () use ($app) {
        return $app->redirect("/static/demo1");
    });

    if (DEV_MODE === true) {
        $app->router->writeJSStub(__DIR__ . "/../app.fe/_routes.ts");
    }

});
