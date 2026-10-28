<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\SubCategory;

class CategorySeeder extends Seeder
{
    public function run()
    {
        // ***********************
        // 1. DEFINE MASTER DATA
        // ***********************
        $categories = [

            // =======================
            // 🔵 GENERAL CATEGORIES
            // =======================
            "RF" => [
                "BDC", "BDC Controller", "BUC", "BUC Controller",
                "LNA Controller", "LNA Switch", "LNA", "LNA Tracking",
                "Switch Box BUC", "Switch Box BDC", "BDC CSM",
                "Monopulse Plate", "TRU", "TWTA", "TWTA RCU"
            ],

            "Utility" => ["Panel", "PAC", "Genset", "AC NWIEE", "ATS", "UPS"],

            "Ancillary" => [
                "Dehidrator", "Rain Blower", "Lampu AWL",
                "Lampu Kingpost", "Lampu HUB", "TFCU/GPS",
                "10 MHz Distribution"
            ],

            "Activity" => ["Belum ada sub kategori"],
            "Antenna Issue" => ["Belum ada sub kategori"],
            "Diesel Refill" => ["Belum ada sub kategori"],
            "Electrical Report" => ["Belum ada sub kategori"],
            "Guest" => ["Belum ada sub kategori"],

            "PM" => [
                "Warming Up Genset",
                "Cleaning Genset, PKG, Tangki BBM & Sum Pit",
                "Cleaning Filter UPS",
                "PM UPS + Battery Testing & Test Discharge Battery",
                "Maintenance Cleaning AC Split & AC Antenna",
                "Cleaning Filter Indoor PAC & Cuci Outdoor PAC",
                "Maintenance PAC",
                "Cleaning Panel Listrik",
                "Load & Temperature Measurement",
                "Grounding Measurement",
                "N-G Voltage Measurement",
                "Maintenance Genset",
                "Electrical Power Quality Measurement",
                "Capture/Setting Parameter RF & Utility",
                "Check Ancillary System",
                "Test Redundancy",
                "PM Antenna Tracking System",
                "PM Antenna Structure",
                "Inspection & Cleaning Rain Blower",
                "PM Antenna Structure TTC",
                "Neutral to Grounding Measurement"
            ],

            "CM" => [
                "Dehydrator", "Rain Blower", "Lampu AWL", "Lampu Kingpost",
                "Lampu HUB", "10 MHz Distribution", "ACU", "ADU",
                "Motorize", "Tracking", "KVM", "BDC", "BDC Controller",
                "BUC", "BUC Controller", "LNA Controller", "LNA Switch",
                "LNA", "LNA Tracking", "Switch Box BUC", "Switch Box BDC",
                "BDC CSM", "Monopulse Plate", "TRU", "TWTA", "TWTA RCU",
                "Panel", "PAC", "Genset", "AC NWIEE", "UPS", "ATS"
            ],

            "Weather" => ["Belum ada sub kategori"],
            "Monitoring" => ["Belum ada sub kategori"],
            "Panel" => ["Belum ada sub kategori"],
            "HUB" => ["Belum ada sub kategori"],

            "TTC Activity" => ["Activity"], // beda dari TTC(KB)
        ];

        // ============================
        // 🔵 KB CATEGORIES (SPECIAL)
        // ============================
        $kbCategories = [
            "RF (KB)" => ["RF"],
            "Utility (KB)" => ["Utility"],
            "Ancillary (KB)" => ["Ancillary"],
            "Activity (KB)" => ["Activity"],
            "Antenna Issue (KB)" => ["Antenna Issue"],
            "Diesel Refill (KB)" => ["Diesel Refill"],
            "Electrical Report (KB)" => ["Electrical Report"],
            "Guest (KB)" => ["Guest"],
            "PM (KB)" => ["PM"],
            "CM (KB)" => ["CM"],
            "Weather (KB)" => ["Weather"],
            "Monitoring (KB)" => ["CSM", "Compass", "Grafana"], // ini custom KB
            "Panel (KB)" => ["Panel"],
            "HUB (KB)" => ["HUB"],
            "TTC (KB)" => ["Activity", "PM", "CM", "RF", "Ancillary", "Utility"],
            "Lainnya (KB)" => ["Belum ada sub kategori"],
        ];

        // =========================================
        // 2. INSERT GENERAL CATEGORY + SUBCATEGORY
        // =========================================
        $savedCategories = [];

        foreach ($categories as $cat => $subs) {

            $category = Category::create([
                "name" => $cat,
                "type" => "general"
            ]);

            foreach ($subs as $sub) {
                SubCategory::create([
                    "category_id" => $category->id,
                    "name" => $sub
                ]);
            }

            // simpan untuk KB reference
            $savedCategories[$cat] = $category;
        }

        // ======================================
        // 3. INSERT KB CATEGORY (SMART LOGIC)
        // ======================================
        foreach ($kbCategories as $cat => $subs) {

            $baseName = trim(str_replace("(KB)", "", $cat));

            $category = Category::create([
                "name" => $cat,
                "type" => "kb"
            ]);

            // Jika subcategory referensi ke category utama (Example: ["RF"])
            if (count($subs) === 1 && isset($savedCategories[$subs[0]])) {

                $refCategory = $savedCategories[$subs[0]];

                foreach ($refCategory->subCategories as $sub) {
                    SubCategory::create([
                        "category_id" => $category->id,
                        "name" => $sub->name
                    ]);
                }
            } else {
                // Jika KB punya subcategory sendiri
                foreach ($subs as $sub) {
                    SubCategory::create([
                        "category_id" => $category->id,
                        "name" => $sub
                    ]);
                }
            }
        }
    }
}
