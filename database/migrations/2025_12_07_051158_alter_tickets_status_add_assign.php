<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up()
    {
        DB::statement("
            ALTER TABLE tickets
            MODIFY status ENUM('open','progress','update','hold','closed','assign') NOT NULL DEFAULT 'open'
        ");
    }

    public function down()
    {
        DB::statement("
            ALTER TABLE tickets
            MODIFY status ENUM('open','progress','update','hold','closed') NOT NULL DEFAULT 'open'
        ");
    }
};
