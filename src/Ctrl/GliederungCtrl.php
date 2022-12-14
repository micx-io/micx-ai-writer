<?php

namespace App\Ctrl;

use App\Api\OpenAiApi;
use App\Api\OpenAiResult;
use App\Type\Text\Artikel;
use Brace\Router\Attributes\BraceRoute;
use Orhanerday\OpenAi\OpenAi;

class GliederungCtrl
{

    public function __construct(
        public OpenAiApi $openAiApi
    ){}

    #[BraceRoute("POST@/{subscription_id}/text/gliederung", "generate_gliederung")]
    public function generateGliederung(array $body) {

        $vorlage = file_get_contents(__DIR__ . "/text/generateGliederung.md");
        $vorlage = preg_replace_callback("/%%(.*?)%%/im", fn($matches) => $body[$matches[1]], $vorlage);
        return $this->openAiApi->textComplete($vorlage, 2500)->getJson();
    }
    #[BraceRoute("POST@/{subscription_id}/text/stockphotos", "generate_article_stockphotos")]
    public function generateArticleStockphotos(array $body) {

        $vorlage = file_get_contents(__DIR__ . "/text/generateStockPhotoSchlagworte.md");
        $vorlage = preg_replace_callback("/%%(.*?)%%/im", fn($matches) => $body[$matches[1]], $vorlage);
        return ["text" => trim ($this->openAiApi->textComplete($vorlage, 2500)->getText())];
    }
    #[BraceRoute("POST@/{subscription_id}/text/lead", "generate_article_lead")]
    public function generateArticleLead(array $body) {

        $vorlage = file_get_contents(__DIR__ . "/text/generateArtikelLead.md");
        $vorlage = preg_replace_callback("/%%(.*?)%%/im", fn($matches) => $body[$matches[1]], $vorlage);
        return ["text" => $this->openAiApi->textComplete($vorlage, 2500)->getText()];
    }
    #[BraceRoute("POST@/{subscription_id}/text/questions", "generate_questions")]
    public function generateQuestions(array $body) {

        $vorlage = file_get_contents(__DIR__ . "/text/generateQuestions.md");
        $vorlage = preg_replace_callback("/%%(.*?)%%/im", fn($matches) => $body[$matches[1]], $vorlage);
        return $this->openAiApi->textComplete($vorlage, 2500)->getJson();
    }
    #[BraceRoute("POST@/{subscription_id}/text/absatz_lead", "generate_absatz_lead")]
    public function generateAbsatzLead(array $body) {

        $vorlage = file_get_contents(__DIR__ . "/text/generateAbsatzLead.md");
        $vorlage = preg_replace_callback("/%%(.*?)%%/im", fn($matches) => $body[$matches[1]], $vorlage);
        return ["text" => $this->openAiApi->textComplete($vorlage, 2500)->getText()];
    }
    #[BraceRoute("POST@/{subscription_id}/text/absatz", "generate_absatz")]
    public function generateAbsatz(array $body) {

        $vorlage = file_get_contents(__DIR__ . "/text/generateAbsatzForQuestion.md");
        $vorlage = preg_replace_callback("/%%(.*?)%%/im", fn($matches) => $body[$matches[1]], $vorlage);
        return ["text" => $this->openAiApi->textComplete($vorlage, 2500)->getText()];
    }


    #[BraceRoute("GET|POST@/{subscription_id}/texte/load/{title}")]
    public function loadGliederung() {
        $obj = new Artikel();
        return (array)$obj;
    }
}
