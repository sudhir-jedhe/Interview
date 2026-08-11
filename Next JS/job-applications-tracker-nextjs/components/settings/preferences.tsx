"use client";

import { Coins, Palette } from "lucide-react";

import { SettingsCard, SettingsRow } from "@/components/settings/settings-card";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/constants";
import { useDefaultCurrency, useMonthlyGoal } from "@/hooks/use-preferences";
import { Input } from "@/components/ui/input";

export function Preferences() {
  const [currency, setCurrency, currencyReady] = useDefaultCurrency();
  const [goal, setGoal, goalReady] = useMonthlyGoal();

  return (
    <>
      <SettingsCard
        title="Appearance"
        description="Applies immediately and is remembered on this device."
        icon={Palette}
      >
        <SettingsRow
          label="Theme"
          hint="System follows your operating system setting."
        >
          <ThemeToggle />
        </SettingsRow>
      </SettingsCard>

      <SettingsCard
        title="Defaults"
        description="Used when you create a new application."
        icon={Coins}
      >
        <SettingsRow
          label="Default currency"
          hint="Pre-selected on the new application form. Existing applications keep theirs."
        >
          <Select
            value={currency}
            onValueChange={setCurrency}
            disabled={!currencyReady}
          >
            <SelectTrigger className="w-full sm:w-44" aria-label="Default currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((option) => (
                <SelectItem key={option.code} value={option.code}>
                  {option.symbol} {option.code} — {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsRow>

        <SettingsRow
          label="Monthly application goal"
          hint="The target shown on your dashboard goal card."
        >
          <Input
            type="number"
            min={1}
            max={200}
            value={goalReady ? goal : ""}
            disabled={!goalReady}
            aria-label="Monthly application goal"
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next)) {
                setGoal(Math.min(200, Math.max(1, next)));
              }
            }}
            className="w-full sm:w-24"
          />
        </SettingsRow>
      </SettingsCard>
    </>
  );
}
