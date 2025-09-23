import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Icon from './Icon';

// Mock the icon assets to avoid import errors in tests
vi.mock('../../assets/icons/paw-print.png', () => ({ default: '/mock-paw-print.png' }));
vi.mock('../../assets/icons/yarn-ball.png', () => ({ default: '/mock-yarn-ball.png' }));
vi.mock('../../assets/icons/cat-clipboard.png', () => ({ default: '/mock-cat-clipboard.png' }));
vi.mock('../../assets/icons/sleeping-cat.png', () => ({ default: '/mock-sleeping-cat.png' }));
vi.mock('../../assets/icons/cat-cross-paws.png', () => ({ default: '/mock-cat-cross-paws.png' }));
vi.mock('../../assets/icons/playful-cat.png', () => ({ default: '/mock-playful-cat.png' }));
vi.mock('../../assets/icons/cat-magnifying-glass.png', () => ({ default: '/mock-cat-magnifying-glass.png' }));
vi.mock('../../assets/icons/cat-food-bowl.png', () => ({ default: '/mock-cat-food-bowl.png' }));
vi.mock('../../assets/icons/cat-calendar.png', () => ({ default: '/mock-cat-calendar.png' }));
vi.mock('../../assets/icons/whiskers-cat-face.png', () => ({ default: '/mock-whiskers-cat-face.png' }));

describe('Icon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with semantic icon name', () => {
    render(<Icon name="add" />);
    
    const icon = screen.getByAltText('add icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/mock-paw-print.png');
    expect(icon).toHaveAttribute('title', 'Add');
  });

  it('renders with direct icon name', () => {
    render(<Icon name="yarn-ball" />);
    
    const icon = screen.getByAltText('yarn-ball icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/mock-yarn-ball.png');
  });

  it('applies custom size', () => {
    render(<Icon name="add" size={32} />);
    
    const icon = screen.getByAltText('add icon');
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
  });

  it('applies default size when not specified', () => {
    render(<Icon name="add" />);
    
    const icon = screen.getByAltText('add icon');
    expect(icon).toHaveAttribute('width', '24');
    expect(icon).toHaveAttribute('height', '24');
  });

  it('applies custom className', () => {
    render(<Icon name="add" className="custom-class" />);
    
    const icon = screen.getByAltText('add icon');
    expect(icon).toHaveClass('custom-class');
  });

  it('uses custom tooltip when provided', () => {
    render(<Icon name="add" tooltip="Custom tooltip" />);
    
    const icon = screen.getByAltText('add icon');
    expect(icon).toHaveAttribute('title', 'Custom tooltip');
  });

  it('auto-generates tooltip from semantic name', () => {
    render(<Icon name="edit" />);
    
    const icon = screen.getByAltText('edit icon');
    expect(icon).toHaveAttribute('title', 'Edit');
  });

  it('applies default styles', () => {
    render(<Icon name="add" />);
    
    const icon = screen.getByAltText('add icon');
    // Check individual style properties since jsdom might not parse all CSS
    expect(icon.style.objectFit).toBe('contain');
    expect(icon.style.backgroundColor).toBe('transparent');
    expect(icon.style.mixBlendMode).toBe('multiply');
  });

  it('passes through additional HTML attributes', () => {
    render(<Icon name="add" data-testid="test-icon" />);
    
    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders null for non-existent icon', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(<Icon name={"non-existent" as any} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith('Icon "non-existent" not found');
    
    consoleSpy.mockRestore();
  });

  it('maps all semantic icons correctly', () => {
    const semanticIcons = [
      { name: 'add', expectedSrc: '/mock-paw-print.png', expectedTitle: 'Add' },
      { name: 'complete', expectedSrc: '/mock-yarn-ball.png', expectedTitle: 'Complete' },
      { name: 'edit', expectedSrc: '/mock-playful-cat.png', expectedTitle: 'Edit' },
      { name: 'delete', expectedSrc: '/mock-cat-cross-paws.png', expectedTitle: 'Delete' },
      { name: 'list', expectedSrc: '/mock-cat-clipboard.png', expectedTitle: 'List' },
      { name: 'search', expectedSrc: '/mock-cat-magnifying-glass.png', expectedTitle: 'Search' },
      { name: 'archive', expectedSrc: '/mock-sleeping-cat.png', expectedTitle: 'Archive' },
      { name: 'category', expectedSrc: '/mock-cat-food-bowl.png', expectedTitle: 'Category' },
      { name: 'calendar', expectedSrc: '/mock-cat-calendar.png', expectedTitle: 'Calendar' },
      { name: 'logo', expectedSrc: '/mock-whiskers-cat-face.png', expectedTitle: 'Logo' },
    ];

    semanticIcons.forEach(({ name, expectedSrc, expectedTitle }) => {
      const { unmount } = render(<Icon name={name as any} />);
      
      const icon = screen.getByAltText(`${name} icon`);
      expect(icon).toHaveAttribute('src', expectedSrc);
      expect(icon).toHaveAttribute('title', expectedTitle);
      
      unmount();
    });
  });
});
