<?php

namespace App\Ctrl;

use App\Manager\PresetManager;
use App\Type\Text\Preset;
use Brace\Router\Attributes\BraceRoute;
use Laminas\Diactoros\ServerRequest;


class PresetCtrl
{

    #[BraceRoute("GET@/{subscription_id}/presets", "preset_list")]
    public function getPresets(ServerRequest $request, PresetManager $presetManager) {
        return $presetManager->getPresets();
    }

    #[BraceRoute("POST@/{subscription_id}/presets", "preset_save")]
    public function savePresets(ServerRequest $request, Preset $body, PresetManager $presetManager) {
        $presetManager->savePreset($body);
        return ["ok"];
    }

}
