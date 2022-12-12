<?php

namespace App\Ctrl;

use App\Api\DeepLApi;
use App\Api\OpenAiApi;
use App\Config\MediaStoreConf;
use Brace\Router\Attributes\BraceRoute;
use Laminas\Diactoros\ServerRequest;

class InfoCtrl
{

    #[BraceRoute("GET@/{subscription_id}/info", "info")]
    public function info(ServerRequest $request, MediaStoreConf $mediaStoreConf) {
        return [
            "scopes" => $mediaStoreConf->mediaStoreSubscriptionInfo->getScopeNames()
        ];
    }

    #[BraceRoute("POST@/{subscription_id}/text", "text")]
    public function getText(ServerRequest $request, array $body) {
        $deepL = new DeepLApi();
        $openAi = new OpenAiApi();

        $question = $body["question"];
        $maxTokens = (int)$body["max_tokens"];
        $bestof = (int)$body["best_of"];
        if ($bestof > 3)
            $bestof = 3;
        if ($maxTokens > 2000)
            $maxTokens = 2000;
        // $question = "Schreibe einen Werbetext für die Homepage eines Zahnarztes über professionelle Zahnreinigung.";
        //$question = $deepL->translate($question, "DE", "EN");
        $text = $openAi->textComplete($question, $maxTokens, $bestof);
        return [
            "text" => wordwrap($text)
        ];
    }


}
