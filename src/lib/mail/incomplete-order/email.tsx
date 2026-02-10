import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type OrderItem = {
  productName: string;
  variationName?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderConfirmationEmailProps = {
  storeName: string;
  supportEmail: string;
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  orderNumber: number;
  createdAt: string;
  currency: string;
  shippingAddress: string;
  subtotalAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  items: OrderItem[];
};

function formatMoney(amount: number, currency: string) {
  try {
    // Node runtime formatting (safe for server-side rendering).
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount ?? 0);
  } catch {
    const safe = Number.isFinite(amount) ? amount : 0;
    return `${safe.toFixed(2)} ${currency || ''}`.trim();
  }
}

function formatDate(value: string) {
  // Keep it simple: upstream already passes a string.
  return value;
}

function safeText(value: unknown) {
  if (value === null || value === undefined) return '';
  return String(value);
}

const styles = {
  body: {
    backgroundColor: '#f6f7fb',
    margin: '0',
    padding: '0',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    color: '#111827',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '24px 12px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e5e7eb',
  },
  brand: {
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.2px',
    margin: '0 0 8px 0',
  },
  heading: {
    fontSize: '22px',
    fontWeight: 700,
    margin: '0 0 8px 0',
    lineHeight: '28px',
  },
  subheading: {
    fontSize: '14px',
    margin: '0 0 0 0',
    color: '#374151',
    lineHeight: '20px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 700,
    margin: '0 0 12px 0',
  },
  divider: {
    borderColor: '#e5e7eb',
    margin: '16px 0',
  },
  kvRow: {
    display: 'table',
    width: '100%',
    marginBottom: '6px',
  },
  kvLabel: {
    display: 'table-cell',
    width: '50%',
    fontSize: '12px',
    color: '#6b7280',
    paddingRight: '10px',
  },
  kvValue: {
    display: 'table-cell',
    width: '50%',
    fontSize: '12px',
    color: '#111827',
    textAlign: 'right' as const,
    wordBreak: 'break-word' as const,
  },
  button: {
    backgroundColor: '#111827',
    borderRadius: '10px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 700,
    padding: '12px 16px',
    textDecoration: 'none',
  },
  itemsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    textAlign: 'left' as const,
    fontSize: '12px',
    color: '#6b7280',
    padding: '8px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    fontSize: '13px',
    padding: '10px 0',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'top' as const,
  },
  right: {
    textAlign: 'right' as const,
  },
  productName: {
    fontWeight: 600,
    margin: '0',
    lineHeight: '18px',
  },
  variation: {
    fontSize: '12px',
    margin: '2px 0 0 0',
    color: '#6b7280',
    lineHeight: '16px',
  },
  footer: {
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: '18px',
    margin: '0',
  },
  link: {
    color: '#111827',
    textDecoration: 'underline',
  },
};

function KeyValueRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={styles.kvRow as React.CSSProperties}>
      <div style={styles.kvLabel as React.CSSProperties}>{label}</div>
      <div style={styles.kvValue as React.CSSProperties}>{value}</div>
    </div>
  );
}

export function Email(props: OrderConfirmationEmailProps) {
  const items = props.items || [];
  const hasDiscount = Number(props.discountAmount || 0) > 0;
  const hasShipping = Number(props.shippingAmount || 0) > 0;

  const previewText = `${props.storeName}: Order #${props.orderNumber} confirmed`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            <Text style={styles.brand}>{safeText(props.storeName)}</Text>
            <Heading style={styles.heading}>Order confirmed</Heading>
            <Text style={styles.subheading}>
              Hi {safeText(props.customerName)}, thanks for your purchase. We’re getting your order ready.
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.sectionTitle}>Order details</Text>
            <KeyValueRow label="Order number" value={`#${safeText(props.orderNumber)}`} />
            <KeyValueRow label="Order date" value={safeText(formatDate(props.createdAt))} />
            <KeyValueRow
              label="Total"
              value={formatMoney(Number(props.totalAmount || 0), safeText(props.currency))}
            />

            <Hr style={styles.divider} />

            <Text style={styles.sectionTitle}>Items</Text>
            {items.length === 0 ? (
              <Text style={styles.subheading}>Your items will appear here once available.</Text>
            ) : (
              <table style={styles.itemsTable} role="presentation">
                <thead>
                  <tr>
                    <th style={styles.th}>Product</th>
                    <th style={{ ...styles.th, ...styles.right }}>Qty</th>
                    <th style={{ ...styles.th, ...styles.right }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={`${item.productName}-${idx}`}>
                      <td style={styles.td}>
                        <p style={styles.productName}>{safeText(item.productName)}</p>
                        {item.variationName ? (
                          <p style={styles.variation}>{safeText(item.variationName)}</p>
                        ) : null}
                      </td>
                      <td style={{ ...styles.td, ...styles.right }}>{item.quantity}</td>
                      <td style={{ ...styles.td, ...styles.right }}>
                        {formatMoney(Number(item.lineTotal ?? item.unitPrice * item.quantity), safeText(props.currency))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <Hr style={styles.divider} />

            <Text style={styles.sectionTitle}>Summary</Text>
            <KeyValueRow
              label="Subtotal"
              value={formatMoney(Number(props.subtotalAmount || 0), safeText(props.currency))}
            />
            {hasShipping ? (
              <KeyValueRow
                label="Shipping"
                value={formatMoney(Number(props.shippingAmount || 0), safeText(props.currency))}
              />
            ) : null}
            {hasDiscount ? (
              <KeyValueRow
                label="Discount"
                value={`-${formatMoney(Number(props.discountAmount || 0), safeText(props.currency))}`}
              />
            ) : null}
            <KeyValueRow
              label={<span style={{ fontWeight: 700 } as React.CSSProperties}>Total</span> as any}
              value={
                <span style={{ fontWeight: 700 } as React.CSSProperties}>
                  {formatMoney(Number(props.totalAmount || 0), safeText(props.currency))}
                </span>
              }
            />

            <Hr style={styles.divider} />

            <Text style={styles.sectionTitle}>Shipping</Text>
            <Text style={styles.subheading}>
              <strong>{safeText(props.customerName)}</strong>
              <br />
              {safeText(props.shippingAddress)}
              <br />
              {safeText(props.phoneNumber)}
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.sectionTitle}>Need help?</Text>
            <Text style={styles.subheading}>
              Reply to this email or contact us at{' '}
              <Link href={`mailto:${props.supportEmail}`} style={styles.link}>
                {safeText(props.supportEmail)}
              </Link>
              .
            </Text>

            <Section style={{ paddingTop: '12px' }}>
              <Button href={`mailto:${props.supportEmail}`} style={styles.button}>
                Contact support
              </Button>
            </Section>
          </Section>

          <Section style={{ padding: '12px 24px 0 24px' }}>
            <Text style={styles.footer}>
              This is an automated message sent to {safeText(props.customerEmail)}. If you didn’t place this order,
              please contact{' '}
              <Link href={`mailto:${props.supportEmail}`} style={styles.link}>
                {safeText(props.supportEmail)}
              </Link>
              .
            </Text>
            <Text style={styles.footer}>Order #{safeText(props.orderNumber)} • {safeText(props.storeName)}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}