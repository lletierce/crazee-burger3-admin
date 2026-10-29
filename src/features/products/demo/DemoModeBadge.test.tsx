import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemoModeBadge } from './DemoModeBadge';
import { resetDemoCatalog } from './resetDemoCatalog';

vi.mock('./resetDemoCatalog', () => ({ resetDemoCatalog: vi.fn() }));

describe('DemoModeBadge', () => {
  beforeEach(() => {
    vi.mocked(resetDemoCatalog).mockReset();
  });

  it('demande une confirmation avant de réinitialiser', async () => {
    const user = userEvent.setup();
    render(<DemoModeBadge onReset={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));

    expect(screen.getByRole('dialog', { name: 'Réinitialiser la démo ?' })).toBeInTheDocument();
    expect(resetDemoCatalog).not.toHaveBeenCalled();
  });

  it("ne réinitialise rien si l'utilisateur annule", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<DemoModeBadge onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));
    await user.click(screen.getByRole('button', { name: 'Annuler' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(resetDemoCatalog).not.toHaveBeenCalled();
    expect(onReset).not.toHaveBeenCalled();
  });

  it('réinitialise puis prévient le parent après confirmation', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    vi.mocked(resetDemoCatalog).mockResolvedValue();
    render(<DemoModeBadge onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Réinitialiser' }));

    expect(resetDemoCatalog).toHaveBeenCalledOnce();
    expect(onReset).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("affiche une erreur et garde la fenêtre ouverte en cas d'échec", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    vi.mocked(resetDemoCatalog).mockRejectedValue(new Error('permission-denied'));
    render(<DemoModeBadge onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: 'Réinitialiser' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Réinitialiser' }));

    expect(await screen.findByText(/La réinitialisation a échoué/)).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(onReset).not.toHaveBeenCalled();
  });
});
