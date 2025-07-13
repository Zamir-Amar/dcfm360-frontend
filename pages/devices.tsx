import { useState } from 'react';
import Head from 'next/head';
import { useDevices } from '../hooks/useDevices';
import { DeviceListView } from '../components/devices/DeviceListView';
import { DeviceCardView } from '../components/devices/DeviceCardView';
import { DevicesLayout } from '../components/devices/DevicesLayout';

export default function DevicesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const { devices, loading, error } = useDevices();

  return (
    <>
      <Head>
        <title>IoT Devices - DCFM360</title>
        <meta name="description" content="DCFM360 IoT Devices" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <DevicesLayout
          title="IoT Device Management"
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
          loading={loading}
          error={error}
        >
          {!Array.isArray(devices) ? (
            <p>Invalid device data received.</p>
          ) : devices.length === 0 ? (
            <p>No devices found.</p>
          ) : viewMode === 'list' ? (
            <DeviceListView devices={devices} />
          ) : (
            <DeviceCardView devices={devices} />
          )}
        </DevicesLayout>
      </main>
    </>
  );
}
