<?php

namespace App\Api;

class DeepLApi
{

    public function getApiKey() {
        return trim (phore_file(CONF_DEEPL_API_KEY_FILE)->get_contents());
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
