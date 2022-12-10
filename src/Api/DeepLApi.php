<?php

namespace App\Api;

class DeepLApi
{

    public function getApiKey() {
        $key = CONF_DEEPL_API_KEY;
        if ($key === "")
            $key = phore_file(CONF_DEEPL_API_KEY_FILE)->get_contents();
        return trim ($key);
    }


    public function translate (string $text, string $sourceLang, string $targetLang) : string {
        return phore_http_request("https://api-free.deepl.com/v2/translate")
            ->withHeaders(["Authorization" => "DeepL-Auth-Key " . $this->getApiKey()])
            ->withPostFormBody([
                "text" => $text,
                "source_lang" => $sourceLang,
                "target_lang" => $targetLang
            ])->send(true)->getBodyJson()["translations"][0]["text"];
    }

}
