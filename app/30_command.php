<?php
namespace App;

use App\Api\DeepLApi;
use App\Api\OpenAiApi;
use Brace\Core\AppLoader;
use Brace\Core\BraceApp;
use Phore\ObjectStore\ObjectStore;

AppLoader::extend(function (BraceApp $app) {
    $app->command->addCommand("testTranslate", function () {
        $a = new DeepLApi();
        echo $a->translate("Hello World", "EN", "DE");
    });
    $app->command->addCommand("testOpenAi", function () {
        $a = new OpenAiApi();
        echo $a->textComplete("Provide welcome sentence for website on cardiatic doctor");
    });

    $app->command->addCommand("test", function () {
        $deepL = new DeepLApi();
        $openAi = new OpenAiApi();

        $question = "Schreibe einen SEO Text warum Webdesign für Zahnärzte wichtig ist.";
       // $question = "Schreibe einen Werbetext für die Homepage eines Zahnarztes über professionelle Zahnreinigung.";
        $question = $deepL->translate($question, "DE", "EN");
        echo "\nQ" . $question;
        $text = $openAi->textComplete($question, 1000);
        echo "\nA: " . $text;
        echo "\n Result: " . $deepL->translate($text, "EN", "DE");
    });
});
