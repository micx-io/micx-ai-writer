<?php

namespace App\Ctrl;

use App\Api\OpenAiApi;
use Brace\Router\Attributes\BraceRoute;
use Brace\Router\Type\RouteParams;

class AutoCompleteCtrl
{
    public function __construct(
        public OpenAiApi $openAiApi
    ){}

    #[BraceRoute("POST@/{subscription_id}/query/{type}", "autocomplete")]
    public function autocomplete(array $body, RouteParams $routeParams) {
        $type = $routeParams->get("type");
        $type = phore_assert($type)->safeFileNameComponentString($type);

        $vorlage = explode("\n", file_get_contents(__DIR__ . "/text/$type.md"));
        $firstLine = phore_json_decode(array_shift($vorlage));
        $vorlage = trim(implode("\n", $vorlage));

        $vorlage = preg_replace_callback("/%%(.*?)%%/im", fn($matches) => $body[$matches[1]], $vorlage);



        if ($firstLine["type"] === "json")
            return ["type" => "json", "result" => $this->openAiApi->textComplete($vorlage, 1500)->getJson()];
        return ["type"=> "text", "result" => $this->openAiApi->textComplete($vorlage, 1500)->getText()];
    }
}
