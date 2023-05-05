<?php

namespace App\Ctrl;

use App\Api\OpenAiApi;
use Brace\Router\Attributes\BraceRoute;
use Brace\Router\Type\RouteParams;

class InvoiceCtrl
{
    public function __construct(
        public OpenAiApi $openAiApi
    ){}





    #[BraceRoute("GET@/{subscription_id}/invoice", "invoice_upload")]
    public function muh() {
        return ["success" => true];
    }

    #[BraceRoute("POST@/{subscription_id}/invoice/transform", "invoice_upload")]
    public function upload(OpenAiApi $openAiApi) {
        out ("load", $_FILES);
        $text = "";
        $name = "";
        foreach ($_FILES as $key => $file) {
            $tempName = $file["tmp_name"];
            $name = $file["name"];
            $name = preg_replace("/[^a-zA-Z0-9_\-.]/", "_", $name);
            $error = $file["error"];
            if ($error !== 0) {
                throw new \HttpException("Upload failed with code: $error");
            }
            $text = phore_exec("pdftotext :file -", ["file" => $tempName]);

        }

        $result = [];
        $prompt = file_get_contents(__DIR__ . "/invoiceprompt.txt") .  "\n\n". $text;
        for($i=0; $i<3; $i++) {
            try {
                $result = $openAiApi->textComplete("", $prompt, 1500)->getJson();
            } catch (\Exception $e) {
                out("OpenAI failed: " . $e->getMessage());
                sleep(1);
                continue;
            }
        }

        return [
            "success" => true,
            "filename" => $name,
            "text" => $result,
        ];
    }
}
