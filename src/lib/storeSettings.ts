'use client';

import { useState, useEffect } from 'react';
import { STORE_INFO } from '../data/catalog';

export interface StoreSettings {
  name: string;
  location: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  landmarks: string;
  mapsLink: string;
  mapsShareLink: string;
  logoUrl: string;
  googleRating: string;
  reviewsCount: string;
  gstNumber: string;
  upiId: string;
  announcementText: string;
  adminPin: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  name: STORE_INFO.name,
  location: STORE_INFO.location,
  tagline: STORE_INFO.tagline,
  address: STORE_INFO.address,
  phone: STORE_INFO.phone,
  whatsapp: STORE_INFO.whatsapp,
  email: STORE_INFO.email,
  hours: STORE_INFO.hours,
  landmarks: STORE_INFO.landmarks,
  mapsLink: STORE_INFO.mapsLink,
  mapsShareLink: STORE_INFO.mapsShareLink,
  logoUrl: STORE_INFO.logoUrl,
  googleRating: STORE_INFO.googleRating,
  reviewsCount: STORE_INFO.reviewsCount,
  gstNumber: '34AAACT8921B1Z9',
  upiId: 'trophymall@upi',
  announcementText: 'Showroom: Lawspet, Airport Road • Open 10 AM – 9 PM • Complimentary Laser Engraving on All Trophies',
  adminPin: 'trophy2026',
};

const SETTINGS_STORAGE_KEY = 'trophymall_store_settings';

export function getStoreSettings(): StoreSettings {
  if (typeof window === 'undefined') return DEFAULT_STORE_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STORE_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn('Error reading store settings:', e);
  }
  return DEFAULT_STORE_SETTINGS;
}

export function saveStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
  const current = getStoreSettings();
  const cleanWhatsapp = (settings.whatsapp !== undefined ? settings.whatsapp : current.whatsapp)
    .replace(/[^0-9]/g, '');
    
  const updated: StoreSettings = {
    ...current,
    ...settings,
    whatsapp: cleanWhatsapp || current.whatsapp,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('store-settings-updated', { detail: updated }));
    } catch (e) {
      console.warn('Error saving store settings:', e);
    }
  }

  return updated;
}

export function resetStoreSettings(): StoreSettings {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('store-settings-updated', { detail: DEFAULT_STORE_SETTINGS }));
    } catch (e) {
      console.warn('Error resetting store settings:', e);
    }
  }
  return DEFAULT_STORE_SETTINGS;
}

export function useStoreSettings(): StoreSettings {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  useEffect(() => {
    setSettings(getStoreSettings());

    const handleUpdate = () => {
      setSettings(getStoreSettings());
    };

    window.addEventListener('store-settings-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('store-settings-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return settings;
}
