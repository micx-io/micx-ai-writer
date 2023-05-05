<?php
namespace App;

use App\Api\OpenAiApi;
use App\Config\MediaStoreConf;
use App\Config\AiWriterSubscriptionInfo;
use App\Manager\ContextManager;
use App\Manager\PresetManager;
use App\Type\RepoConf;
use App\Type\StorageFacet;
use Brace\Command\CommandModule;
use Brace\Core\AppLoader;
use Brace\Core\BraceApp;
use Brace\Core\EnvironmentType;
use Brace\Dbg\BraceDbg;
use Brace\Mod\Request\Zend\BraceRequestLaminasModule;
use Brace\Router\RouterModule;
use Brace\Router\Type\RouteParams;

use Lack\Freda\Filesystem\PosixFileSystem;
use Lack\Freda\FredaModule;
use Lack\Subscription\Brace\SubscriptionClientModule;
use Lack\Subscription\Type\T_Subscription;
use Orhanerday\OpenAi\OpenAi;
use Phore\Di\Container\Producer\DiService;
use Phore\Di\Container\Producer\DiValue;
use Phore\ObjectStore\Driver\GoogleObjectStoreDriver;
use Phore\ObjectStore\ObjectStore;
use Phore\VCS\VcsFactory;
use Psr\Http\Message\ServerRequestInterface;


BraceDbg::SetupEnvironment(true, ["192.168.178.20", "aiwriter.micx.io" => EnvironmentType::TEST, "localhost" => EnvironmentType::TEST, "localhost:5000"]);


AppLoader::extend(function () {
    $app = new BraceApp();

    // Use Laminas (ZendFramework) Request Handler
    $app->addModule(new BraceRequestLaminasModule());

    // Use the Uri-Based Routing
    $app->addModule(new RouterModule());
    $app->addModule(new CommandModule());

    $app->addModule(
        new SubscriptionClientModule(
            CONF_SUBSCRIPTION_ENDPOINT,
            CONF_SUBSCRIPTION_CLIENT_ID,
            CONF_SUBSCRIPTION_CLIENT_SECRET
        )
    );


    $app->define("presetManager", new DiService(function(T_Subscription $subscription) {
        $manager = new PresetManager(CONF_STORE_PATH_PRESETS);
        $manager->setSubscriptionId($subscription->subscription_id);
        return $manager;
    } ));

    $app->define("contextManager", new DiService(function(T_Subscription $subscription) {
        $manager = new ContextManager(CONF_STORE_PATH_PRESETS);
        $manager->setSubscriptionId($subscription->subscription_id);
        return $manager;
    } ));


    $app->define("openAiApi", new DiService(fn() => new OpenAiApi()));

    // Define the app so it is also available in dependency-injection
    $app->define("app", new DiValue($app));


    return $app;
});
