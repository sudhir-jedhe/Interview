/**
 * Rider profile — KYC, the assets they hold, earnings, and who to call.
 *
 * The emergency contact is deliberately at the top of the right column, not
 * buried in a details tab. It is the field that matters at exactly the
 * moment nobody has time to hunt for it.
 */

import { useNavigate, useParams } from 'react-router-dom';

import { getRider } from '@/lib/api/client';
import { setRiderKyc } from '@/lib/api/mutations';
import { useAsync } from '@/hooks/useAsync';
import { useDbVersion } from '@/hooks/useDb';
import { useAuth } from '@/features/auth/AuthProvider';
import { formatDateTime, formatNumber, orDash } from '@/lib/utils/format';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { BarChart } from '@/components/charts/BarChart';
import { useToast } from '@/components/ui/Toast';
import { Can } from '@/features/auth/ProtectedRoute';

export function RiderInfoPage() {
  const { id = '' } = useParams<{ id: string }>();
  const version = useDbVersion();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const { data: rider, error, isLoading, refetch } = useAsync(
    ({ signal }) => getRider(id, signal),
    [id, version],
    { enabled: id !== '' }
  );

  if (error) {
    return (
      <div className="page">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !rider) {
    return (
      <div className="page">
        <Skeleton height={32} width={240} />
        <Skeleton height={360} />
      </div>
    );
  }

  const total = rider.earnings.reduce((sum, e) => sum + e.amount, 0);
  const best = rider.earnings.reduce((max, e) => Math.max(max, e.amount), 0);

  return (
    <>
      <Breadcrumbs currentLabel={rider.name} />

      <div className="page">
        <div className="row">
          <h1 className="page-title">{rider.name}</h1>
          <Badge
            tone={rider.kycStatus === 'verified' ? 'success' : rider.kycStatus === 'pending' ? 'warning' : 'danger'}
          >
            KYC {rider.kycStatus}
          </Badge>

          <span className="spacer" />

          <Can permission="rider:manage">
            {rider.kycStatus !== 'verified' && (
              <Button
                variant="primary"
                icon="check"
                onClick={() => {
                  setRiderKyc(rider.id, 'verified', user);
                  toast.success(`${rider.name} marked verified`);
                }}
              >
                Mark verified
              </Button>
            )}
            {rider.kycStatus !== 'rejected' && (
              <Button
                variant="ghost"
                onClick={() => {
                  setRiderKyc(rider.id, 'rejected', user);
                  toast.show(`${rider.name} marked rejected`, 'warning');
                }}
              >
                Reject
              </Button>
            )}
          </Can>
        </div>

        <div className="split">
          <div className="grid" style={{ gap: 'var(--sp-4)' }}>
            <Card title="Earnings, last 14 days">
              <BarChart
                data={rider.earnings.map((e) => ({ label: e.day, value: e.amount }))}
                height={230}
                yLabel="Local currency"
                formatValue={(n) => formatNumber(n)}
              />
              <div className="row" style={{ marginTop: 'var(--sp-3)', gap: 'var(--sp-4)', fontSize: 'var(--fs-sm)' }}>
                <span>
                  Total <strong>{formatNumber(total)}</strong>
                </span>
                <span>
                  Best day <strong>{formatNumber(best)}</strong>
                </span>
                <span>
                  Daily average <strong>{formatNumber(Math.round(total / rider.earnings.length))}</strong>
                </span>
              </div>
            </Card>

            <Card title="Identity">
              <div className="kv">
                <Field label="Phone" value={rider.phone} />
                <Field label="Country" value={rider.country} />
                <Field label="KYC document" value={rider.kycDocument} />
                <Field label="Licence number" value={rider.licenceNo} />
                <Field label="Joined" value={formatDateTime(rider.joinedAt)} />
              </div>
            </Card>
          </div>

          <div className="grid" style={{ gap: 'var(--sp-4)' }}>
            <Card title="Emergency contact" accent>
              <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 650 }}>{rider.emergencyName}</div>
              <a
                href={`tel:${rider.emergencyPhone.replace(/\s/g, '')}`}
                className="row"
                style={{ gap: 'var(--sp-2)', marginTop: 'var(--sp-2)', color: 'var(--text-link)' }}
              >
                <Icon name="contact" size={16} />
                {rider.emergencyPhone}
              </a>
            </Card>

            <Card title="Assigned assets">
              <div className="grid" style={{ gap: 'var(--sp-3)' }}>
                <div className="row">
                  <Icon name="bike" size={16} />
                  <span>{orDash(rider.vehicleNo)}</span>
                  <span className="spacer" />
                  {rider.vehicleId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/tracking/vehicle-tracking/info/${rider.vehicleId}`)}
                    >
                      Track
                    </Button>
                  )}
                </div>

                <div className="row">
                  <Icon name="battery" size={16} />
                  <span>{orDash(rider.batteryId)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 'var(--fs-xs)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 'var(--fs-md)', fontWeight: 600 }}>{value}</div>
    </div>
  );
}
