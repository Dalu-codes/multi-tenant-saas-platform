import React, { useState, useEffect } from 'react';
import { type Product } from '../types';
import { fetchProductsByTenant, createProductForTenant } from '../services/api';

interface DashboardProps {
  tenantId: string;
}

// ---------------------------------------------------------------------------
// Design System Token Map
// Sizes are kept in plain px on purpose (not rem): a component that ships
// into a host app shouldn't inherit whatever root font-size the host page
// sets. That mismatch is what made the last version render ~40% too large.
// ---------------------------------------------------------------------------
const colors = {
  blue50: '#ebeff0',
  blue100: '#c0ccd0',
  blue200: '#a1b4b9',
  blue300: '#769299',
  blue400: '#5c7d85',
  blue500: '#335c67', // Main accent
  blue600: '#2e545e',
  blue700: '#244149',
  blue800: '#1c3339', // Heavy dark core
  blue900: '#15272b', // Deep text / neutral
  // No red exists in the provided palette. Errors need one for contrast
  // reasons (blue alone can't signal "something failed"); flagging this as
  // a gap to add to the design system rather than inventing a token silently.
  errorText: '#b3261e',
  errorBg: '#fdecea',
};

const type = {
  header: '22px',
  label: '15px',
  button: '14px',
  heading: '32px',
  body: '15px',
  small: '13px',
};

const FONT = "'Poppins', sans-serif";
const RADIUS = '8px'; // one radius token reused everywhere: inputs, buttons, cards

const WORKSPACES = [
  { id: 'company-a', label: 'Company A workspace' },
  { id: 'company-b', label: 'Company B workspace' },
];

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export const Dashboard = ({ tenantId }: DashboardProps) => {
  const [selectedTenant, setSelectedTenant] = useState(tenantId);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProductsByTenant(selectedTenant)
      .then(data => setProducts(data))
      .catch(err => {
        console.error('Failed to load data', err);
        setError('Could not load products for this tenant. Try switching workspaces or reloading.');
      })
      .finally(() => setLoading(false));
  }, [selectedTenant]);

  const canSubmit = newProductName.trim().length > 0 && newProductPrice.trim().length > 0 && !saving;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError(null);
    try {
      const savedProduct = await createProductForTenant(selectedTenant, {
        name: newProductName.trim(),
        price: parseFloat(newProductPrice),
        tenantId: selectedTenant,
      });
      setProducts(prev => [...prev, savedProduct]);
      setNewProductName('');
      setNewProductPrice('');
    } catch (err) {
      console.error('Error creating product', err);
      setError('Save Item failed. Nothing was added — check the values and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: FONT, backgroundColor: '#ffffff', minHeight: '100vh', color: colors.blue900 }}>
      <style>{`
        .mtp-switch-btn {
          border: none;
          cursor: pointer;
          font-family: ${FONT};
          font-size: ${type.button};
          font-weight: 500;
          padding: 10px 20px;
          border-radius: ${RADIUS};
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .mtp-switch-btn.active {
          background-color: ${colors.blue500};
          color: #ffffff;
        }
        .mtp-switch-btn:not(.active) {
          background-color: ${colors.blue50};
          color: ${colors.blue600};
        }
        .mtp-switch-btn:not(.active):hover {
          background-color: ${colors.blue100};
        }
        .mtp-switch-btn:focus-visible,
        .mtp-save-btn:focus-visible {
          outline: 2px solid ${colors.blue700};
          outline-offset: 2px;
        }
        .mtp-input {
          font-family: ${FONT};
          font-size: ${type.body};
          padding: 13px 16px;
          border-radius: ${RADIUS};
          border: 1px solid ${colors.blue300};
          outline: none;
          background-color: #ffffff;
          color: ${colors.blue900};
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .mtp-input::placeholder {
          color: ${colors.blue500};
        }
        .mtp-input:focus {
          border-color: ${colors.blue500};
          box-shadow: 0 0 0 3px rgba(51, 92, 103, 0.18);
        }
        .mtp-save-btn {
          font-family: ${FONT};
          font-size: ${type.button};
          font-weight: 600;
          padding: 13px 28px;
          border-radius: ${RADIUS};
          border: none;
          cursor: pointer;
          background-color: ${colors.blue800};
          color: #ffffff;
          transition: background-color 0.15s ease, opacity 0.15s ease;
          white-space: nowrap;
        }
        .mtp-save-btn:hover:not(:disabled) {
          background-color: ${colors.blue700};
        }
        .mtp-save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {/* Top bar */}
      <header
        style={{
          padding: '20px 32px',
          borderBottom: `1px solid ${colors.blue50}`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: type.header,
            fontWeight: 600,
            color: colors.blue900,
          }}
        >
          Enterprise Multi-Tenant Panel: {selectedTenant.toUpperCase()}
        </h1>
      </header>

      {/* Tenant workspace switcher */}
      <div
        role="group"
        aria-label="Tenant workspace switcher"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          padding: '28px 32px 0',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: type.label, color: colors.blue600 }}>
          Tenant workspace switcher:
        </span>
        {WORKSPACES.map(ws => (
          <button
            key={ws.id}
            type="button"
            className={`mtp-switch-btn${selectedTenant === ws.id ? ' active' : ''}`}
            aria-pressed={selectedTenant === ws.id}
            onClick={() => setSelectedTenant(ws.id)}
          >
            {ws.label}
          </button>
        ))}
      </div>

      {/* Add product form */}
      <div style={{ padding: '72px 32px 0', textAlign: 'center' }}>
        <h2
          style={{
            margin: '0 0 28px',
            fontSize: type.heading,
            fontWeight: 600,
            color: colors.blue800,
          }}
        >
          Add products for this tenant
        </h2>

        <form
          onSubmit={handleCreateProduct}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'left', width: '260px' }}>
            <label htmlFor="mtp-product-name" style={srOnly}>
              Product name
            </label>
            <input
              id="mtp-product-name"
              type="text"
              placeholder="Product Name"
              value={newProductName}
              onChange={e => setNewProductName(e.target.value)}
              className="mtp-input"
            />
          </div>

          <div style={{ textAlign: 'left', width: '260px', position: 'relative' }}>
            <label htmlFor="mtp-product-price" style={srOnly}>
              Price in dollars
            </label>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.blue500,
                fontSize: type.body,
                pointerEvents: 'none',
              }}
            >
              $
            </span>
            <input
              id="mtp-product-price"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="Price"
              value={newProductPrice}
              onChange={e => setNewProductPrice(e.target.value)}
              className="mtp-input"
              style={{ paddingLeft: '28px' }}
            />
          </div>

          <button type="submit" className="mtp-save-btn" disabled={!canSubmit}>
            {saving ? 'Saving…' : 'Save Item'}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            style={{
              marginTop: '20px',
              fontSize: type.small,
              color: colors.errorText,
              backgroundColor: colors.errorBg,
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: RADIUS,
            }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Stored inventory */}
      <div style={{ maxWidth: '600px', margin: '56px auto 0', padding: '0 32px 64px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 500,
            color: colors.blue800,
            marginBottom: '16px',
            textAlign: 'left',
          }}
        >
          Stored Inventory Records
        </h3>

        {loading ? (
          <p style={{ color: colors.blue600, fontStyle: 'italic', fontSize: type.body }}>
            Loading dynamic tenant state...
          </p>
        ) : products.length === 0 ? (
          <p style={{ color: colors.blue600, fontStyle: 'italic', fontSize: type.body }}>
            No records found for this tenant yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {products.map(product => (
              <div
                key={product.id}
                style={{
                  padding: '14px 20px',
                  borderRadius: RADIUS,
                  border: `1px solid ${colors.blue300}`,
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 500, color: colors.blue900, fontSize: type.body }}>
                  {product.name}
                </span>
                <span style={{ fontWeight: 600, color: colors.blue600, fontSize: type.body }}>
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};