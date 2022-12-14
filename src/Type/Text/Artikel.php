<?php

namespace App\Type\Text;

class Artikel
{

    /**
     * @var string
     */
    public string $context;

    /**
     * @var string
     */
    public string $thema;

    /**
     * @var string[]
     */
    public array $titel = [];


    public array $abstract = [];

    /**
     * @var
     */
    public array $gliederung = []

}
