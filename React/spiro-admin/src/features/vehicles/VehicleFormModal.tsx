/**
 * Add / edit a vehicle.
 *
 * The IMEI rule is the one worth reading: it must be 15 digits AND unique.
 * Two bikes reporting under one IMEI is not a cosmetic duplicate — every
 * distance, energy and utilisation figure downstream silently becomes wrong,
 * and nothing in the UI would ever show you why.
 *
 * A newly created vehicle starts OFFLINE with an empty track, because it has
 * not reported yet. Seeding it with a fake position and a full battery would
 * be a lie the dashboard then averages into its totals.
 */

import { useEffect, useId, useState, type FormEvent } from 'react';

import type { Country, Vehicle, VehicleModel } from '@/types/domain';
import { COUNTRIES, VEHICLE_MODELS } from '@/types/domain';
import {
  createVehicle,
  updateVehicle,
  validateVehicle,
  type Errors,
  type VehicleDraft,
} from '@/lib/api/mutations';
import { useAuth } from '@/features/auth/AuthProvider';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';

const MODEL_OPTIONS = VEHICLE_MODELS.map((m) => ({ value: m, label: m }));
const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c, label: c }));

const EMPTY: VehicleDraft = {
  vehicleNo: '',
  imei: '',
  model: 'COMMANDO',
  country: 'Togo',
  batteryId: '',
  assignedTo: '',
};

export function VehicleFormModal({
  open,
  vehicle,
  onClose,
}: {
  open: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const toast = useToast();
  const formId = useId();

  const [draft, setDraft] = useState<VehicleDraft>(EMPTY);
  const [errors, setErrors] = useState<Errors<VehicleDraft>>({});
  const [touched, setTouched] = useState<Set<keyof VehicleDraft>>(new Set());

  useEffect(() => {
    if (!open) return;
    setDraft(
      vehicle
        ? {
            vehicleNo: vehicle.vehicleNo,
            imei: vehicle.imei,
            model: vehicle.model,
            country: vehicle.country,
            batteryId: vehicle.batteryId,
            assignedTo: vehicle.assignedTo ?? '',
          }
        : EMPTY
    );
    setErrors({});
    setTouched(new Set());
  }, [open, vehicle]);

  const set = <K extends keyof VehicleDraft>(key: K, value: VehicleDraft[K]) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    if (touched.has(key)) setErrors(validateVehicle(next, vehicle?.id));
  };

  const blur = (key: keyof VehicleDraft) => {
    const next = new Set(touched);
    next.add(key);
    setTouched(next);
    setErrors(validateVehicle(draft, vehicle?.id));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const found = validateVehicle(draft, vehicle?.id);
    setErrors(found);
    setTouched(new Set(Object.keys(draft) as (keyof VehicleDraft)[]));
    if (Object.keys(found).length > 0) return;

    try {
      if (vehicle) {
        updateVehicle(vehicle.id, draft, user);
        toast.success(`${draft.vehicleNo} updated`);
      } else {
        createVehicle(draft, user);
        toast.success(`${draft.vehicleNo.toUpperCase()} added to the fleet`);
      }
      onClose();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const shown = (key: keyof VehicleDraft) => (touched.has(key) ? errors[key] ?? null : null);

  return (
    <Modal
      open={open}
      title={vehicle ? `Edit ${vehicle.vehicleNo}` : 'Add vehicle'}
      description={
        vehicle
          ? undefined
          : 'The vehicle is created offline with no odometer or trail. It becomes live on its first telemetry frame.'
      }
      onClose={onClose}
      width={560}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {/* `form` associates a button outside the <form> with it, so the
              footer submits for real — no synthesised event, and Enter in
              any field does the same thing the button does. */}
          <Button variant="primary" type="submit" form={formId}>
            {vehicle ? 'Save changes' : 'Add vehicle'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} className="grid" style={{ gap: 'var(--sp-4)' }}>
        <div className="kv">
          <Input
            label="Registration"
            placeholder="EC2832"
            value={draft.vehicleNo}
            error={shown('vehicleNo')}
            onChange={(e) => set('vehicleNo', e.target.value)}
            onBlur={() => blur('vehicleNo')}
            autoComplete="off"
          />

          <Input
            label="IMEI"
            placeholder="15 digits"
            inputMode="numeric"
            value={draft.imei}
            error={shown('imei')}
            onChange={(e) => set('imei', e.target.value.replace(/\D/g, '').slice(0, 15))}
            onBlur={() => blur('imei')}
            autoComplete="off"
          />
        </div>

        <div className="kv">
          <div className="field">
            <span className="field__label">Model</span>
            <Select
              value={draft.model}
              options={MODEL_OPTIONS}
              onChange={(v) => set('model', v as VehicleModel)}
            />
          </div>

          <div className="field">
            <span className="field__label">Country</span>
            <Select
              value={draft.country}
              options={COUNTRY_OPTIONS}
              onChange={(v) => set('country', v as Country)}
            />
          </div>
        </div>

        <Input
          label="Battery ID"
          placeholder="BAT-000123"
          value={draft.batteryId}
          error={shown('batteryId')}
          onChange={(e) => set('batteryId', e.target.value)}
          onBlur={() => blur('batteryId')}
          autoComplete="off"
        />

        <Input
          label="Assigned rider (optional)"
          value={draft.assignedTo}
          onChange={(e) => set('assignedTo', e.target.value)}
          autoComplete="off"
        />

      </form>
    </Modal>
  );
}
