<?php

namespace App\Api;

use Orhanerday\OpenAi\OpenAi;

class OpenAiApi
{

    public function getApiKey() {
        $key = CONF_OPENAI_API_KEY;
        if ($key === "")
            $key = phore_file(CONF_OPENAI_API_KEY_FILE)->get_contents();
        return trim ($key);
    }


    public function textComplete($promptNotUsed, $question, $maxTokens=150, $bestof=1) : OpenAiResult {
        $api = new OpenAi($this->getApiKey());

        $input = [ 'model' => 'gpt-3.5-turbo',
            'messages' => [
                [
                    "role" => "user",
                    "content" => $question
                ],

            ],
            'temperature' => 1.0,
            // 'max_tokens' => $maxTokens,
            'frequency_penalty' => 0,
            'presence_penalty' => 0,
        ];
        out("Input", $input);

        $ret = $api->chat($input);
        out($ret);
        /*
        $ret = $api->completion([
            "model" => "text-davinci-004",
            "prompt" => $question,
            "temperature" => 0.6,
            "max_tokens"=>$maxTokens,
            "top_p" => 1,
            "best_of" => $bestof,
            "frequency_penalty"=>1,
            "presence_penalty"=>1
        ]);
        */
        $ret = phore_json_decode($ret);
        out ($ret);
        return new OpenAiResult($ret);
    }



}
