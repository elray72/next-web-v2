# Color System

A comprehensive color system for multi-tenant theming, inspired by modern design systems.

## Color Variables

### Brand Colors

#### Primary
- `--primary`: Main brand color
- `--primary-foreground`: Text color on primary background
- `--primary-hover`: Hover state
- `--primary-active`: Active/pressed state

#### Secondary
- `--secondary`: Secondary brand color
- `--secondary-foreground`: Text color on secondary background
- `--secondary-hover`: Hover state
- `--secondary-active`: Active/pressed state

#### Tertiary
- `--tertiary`: Tertiary brand color
- `--tertiary-foreground`: Text color on tertiary background
- `--tertiary-hover`: Hover state
- `--tertiary-active`: Active/pressed state

#### Accent
- `--accent`: Accent color for highlights
- `--accent-foreground`: Text color on accent background
- `--accent-hover`: Hover state
- `--accent-active`: Active/pressed state

### Semantic Colors

#### Positive (Success)
- `--positive`: Success/positive action color
- `--positive-foreground`: Text on positive background
- `--positive-bg`: Light positive background
- `--positive-border`: Positive border color

#### Negative (Error)
- `--negative`: Error/destructive action color
- `--negative-foreground`: Text on negative background
- `--negative-bg`: Light negative background
- `--negative-border`: Negative border color

#### Warning
- `--warning`: Warning/caution color
- `--warning-foreground`: Text on warning background
- `--warning-bg`: Light warning background
- `--warning-border`: Warning border color

#### Info
- `--info`: Informational color
- `--info-foreground`: Text on info background
- `--info-bg`: Light info background
- `--info-border`: Info border color

### Background Colors

- `--background`: Primary page background
- `--background-subtle`: Subtle variation (sections, alternating rows)
- `--background-muted`: More pronounced muted background
- `--background-overlay`: Semi-transparent overlay (modals, dropdowns)
- `--background-inverse`: Inverse background for contrast

### Foreground Colors

- `--foreground`: Primary text color
- `--foreground-muted`: Secondary/muted text
- `--foreground-subtle`: Tertiary/placeholder text
- `--foreground-inverse`: Text on inverse backgrounds

### Surface Colors

For cards, panels, and elevated elements:

- `--surface-1`: Primary surface (cards)
- `--surface-2`: Secondary surface (nested cards)
- `--surface-3`: Tertiary surface (deeply nested)

### Border Colors

- `--border`: Default border color
- `--border-subtle`: Subtle border (dividers)
- `--border-strong`: Emphasized border
- `--border-hover`: Border on hover
- `--border-focus`: Focus ring/highlight border

### Form Colors

- `--input-bg`: Input background
- `--input-border`: Input border
- `--input-border-hover`: Input border on hover
- `--input-border-focus`: Input border when focused
- `--input-placeholder`: Placeholder text color
- `--input-disabled-bg`: Disabled input background
- `--input-disabled-text`: Disabled input text

### Shadow

- `--shadow`: Base shadow color (rgba)
- `--shadow-sm`: Small shadow (1px elevation)
- `--shadow-md`: Medium shadow (4px elevation)
- `--shadow-lg`: Large shadow (10px elevation)
- `--shadow-xl`: Extra large shadow (20px elevation)

## Usage Examples

### In Components

```tsx
// Using brand colors
<button style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
  Primary Button
</button>

// Using semantic colors
<div style={{ 
  background: 'var(--positive-bg)', 
  border: '1px solid var(--positive-border)',
  color: 'var(--positive)'
}}>
  Success message
</div>

// Using surface colors
<div style={{ 
  background: 'var(--surface-1)', 
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-md)'
}}>
  Card content
</div>
```

### In SCSS Modules

```scss
.card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius);
}

.submitButton {
  background: var(--primary);
  color: var(--primary-foreground);
  
  &:hover {
    background: var(--primary-hover);
  }
  
  &:active {
    background: var(--primary-active);
  }
}

.errorMessage {
  background: var(--negative-bg);
  color: var(--negative);
  border-left: 4px solid var(--negative-border);
}
```

## Tenant Theming

Each tenant (MCD, TWD, DW) has its own color palette:

### MCD (Mayo Clinic)
- **Primary**: Mayo blue (#0051a5)
- **Theme**: Professional medical blue
- **Background**: Light blue-grey (#f5f7fa)

### TWD (The Wellness District)
- **Primary**: Wellness green (#00a65a)
- **Theme**: Natural, calming green
- **Background**: Light green tint (#f5faf7)

### DW (Digital Wellness)
- **Primary**: Digital purple (#7c3aed)
- **Theme**: Modern tech purple
- **Background**: Clean white (#fafafa)

## Dark Mode

All colors automatically adjust for dark mode via the `.dark` class. Dark mode variants use:
- Darker backgrounds
- Lighter text
- Adjusted semantic colors for better visibility
- Enhanced contrast ratios

## Button Variants

The Button component now supports all color variants:

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="positive">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```
