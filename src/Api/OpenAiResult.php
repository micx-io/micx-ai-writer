<?php

namespace App\Api;

class OpenAiResult
{

    public function __construct(
        public $data
    ) {

    }


    public function getText() : string {
        if (isset($this->data["choices"][0]["text"]))
            return $this->data["choices"][0]["text"];
        return "";
    }

    /**
     * @template T
     * @param class-string $cast
     * @return T
     */
    public function getJson(string $cast = null) {
        $text = trim($this->getText());

        $text = str_replace('“', "\"", $text);
        $text = str_replace(' ', "", $text);
        $text = str_replace('”', "\"", $text);
        $text = str_replace('„', "\"", $text);
        $text = str_replace('’', "\"", $text);
        $text = str_replace('‘', "\"", $text);
        $text = str_replace("'", "\"", $text);

        $text = preg_replace("/^[^{\[]+/", "", $text);
        $text = preg_replace("/\",[ ]*\]/m", "\"]", $text);
        $text = preg_replace('/\/\/(.*?)\n/im', "", $text);

        $text = preg_replace_callback("/([a-z0-9]+)\:[ ]*\"/", fn($machtes) => $machtes[1] . ":\"", $text);

        $text = str_replace("\n", "", $text);
        out ($text);
        $json = json_decode($text);
        if ( ! $json)
            throw new \Exception("Cannot decode json: $text");
        if ($cast === null)
            return $json;
        return phore_hydrate($json, $cast);
    }
}
