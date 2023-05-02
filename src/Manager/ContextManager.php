<?php

namespace App\Manager;

use App\Type\Text\Context;

class ContextManager
{

    public ?string $subscriptionId;

    public function __construct(
        public string $storeRoot
    ){
        if ( ! file_exists($storeRoot))
            mkdir($storeRoot, 0777, true);
    }

    public function setSubscriptionId(?string $subscriptionId) :void {
        $this->subscriptionId = $subscriptionId;
    }

    public function getSubscriptionId() : ?string {
        return $this->subscriptionId;
    }

    /**
     * @param string $contextId
     * @return Context[]
     * @throws \Exception
     */
    public function getContexts(string $contextId=null) : array {
        $ContextFile = phore_file($this->storeRoot . "/" . $this->subscriptionId . ".context.json");
        if ( ! $ContextFile->exists())
           $ContextFile->set_json([]);
        $contexts = $ContextFile->get_json();
        if ($contextId === null)
            return array_values($contexts);
        return $contexts[$contextId] ?? throw new \Exception("Context not found");
    }

    public function saveContext(Context $Context) {
        $ContextFile = $this->storeRoot . "/" . $this->subscriptionId . ".context.json";
        if ( ! file_exists($ContextFile))
            file_put_contents($ContextFile, "[]");
        $Contexts = phore_json_decode(file_get_contents($ContextFile));
        if ($Context->contextId === null)
            $Context->contextId = phore_random_str(8);
        $Contexts[$Context->contextId] = $Context;
        if ($Context->prompt === "")
            unset($Contexts[$Context->contextId]);

        phore_file($ContextFile)->set_json($Contexts);
    }

}
