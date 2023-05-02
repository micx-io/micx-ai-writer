<?php

namespace App\Ctrl;

use App\Manager\ContextManager;
use App\Manager\PresetManager;
use App\Type\Text\Context;
use App\Type\Text\Preset;
use Brace\Router\Attributes\BraceRoute;
use Laminas\Diactoros\ServerRequest;


class ContextCtrl
{

    #[BraceRoute("GET@/{subscription_id}/context", "context_list")]
    public function getContext(ServerRequest $request, ContextManager $contextManager) {
        return $contextManager->getContexts();
    }

    #[BraceRoute("POST@/{subscription_id}/context", "context_save")]
    public function saveContext(ServerRequest $request, Context $body, ContextManager $contextManager) {
        $contextManager->saveContext($body);
        return ["ok"];
    }

}
