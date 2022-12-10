<?php

namespace App\Api;

use Orhanerday\OpenAi\OpenAi;

class OpenAiApi
{

    public function getApiKey() {
        return trim (phore_file(CONF_OPENAI_API_KEY_FILE)->get_contents());
    }


    public function textComplete($question, $maxTokens=150, $bestof=1) {
        $api = new OpenAi($this->getApiKey());
        $ret = $api->completion([
            "model" => "text-davinci-003",
            "prompt" => $question,
            "temperature" => 0.6,
            "max_tokens"=>$maxTokens,
            "top_p" => 1,
            "best_of" => $bestof,
            "frequency_penalty"=>1,
            "presence_penalty"=>1
        ]);
        $ret = phore_json_decode($ret);
        if (isset($ret["choices"][0]["text"]))
            return $ret["choices"][0]["text"];
        throw new \Exception("OpenAi Exception: " . print_r($ret, true));
    }



}
