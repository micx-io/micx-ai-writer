<?php

namespace App\Type\OpenAi;

class AiArtikel
{

    /**
     * @var string
     */
    public string $titel;

    /**
     * @var AiGliederung[]
     */
    public array $gliederung = [];
}
