<?php

namespace App\Manager;

use App\Type\Text\Preset;

class PresetManager
{

    public ?string $subscriptionId;

    public function __construct(
        public string $storeRoot
    ){
        if ( ! file_exists($storeRoot))
            mkdir($storeRoot, 0777, true);
    }

    public function setSubscriptionId(?string $subscriptionId) :void {
        $this->subscriptionId = $subscriptionId;
    }

    public function getSubscriptionId() : ?string {
        return $this->subscriptionId;
    }

    /**
     * @param string $presetId
     * @return Preset[]
     * @throws \Exception
     */
    public function getPresets(string $presetId=null) : array {
        $presetFile = phore_file($this->storeRoot . "/" . $this->subscriptionId . ".json");
        if ( ! $presetFile->exists())
           $presetFile->set_json([]);
        $presets = $presetFile->get_json();
        if ($presetId === null)
            return array_values($presets);
        return $presets[$presetId] ?? throw new \Exception("Preset not found");
    }

    public function savePreset(Preset $preset) {
        $presetFile = $this->storeRoot . "/" . $this->subscriptionId . ".json";
        if ( ! file_exists($presetFile))
            file_put_contents($presetFile, "[]");
        $presets = phore_json_decode(file_get_contents($presetFile));
        if ($preset->presetId === null)
            $preset->presetId = phore_random_str(8);
        $presets[$preset->presetId] = $preset;
        if ($preset->prompt === "")
            unset($presets[$preset->presetId]);

        phore_file($presetFile)->set_json($presets);
    }

}
