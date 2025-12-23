import type { ThemeType } from '../types';

/**
 * 테마 관리 클래스
 * 다크/라이트 모드를 관리합니다.
 */
export class ThemeManager {
    private currentTheme: ThemeType;
    private readonly STORAGE_KEY = 'calc_theme';

    constructor() {
        this.currentTheme = this.loadTheme();
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeListener();
    }

    /**
     * LocalStorage에서 테마를 불러옵니다.
     */
    private loadTheme(): ThemeType {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
            return saved as ThemeType;
        }
        return 'system';
    }

    /**
     * 테마를 LocalStorage에 저장합니다.
     */
    private saveTheme(theme: ThemeType): void {
        localStorage.setItem(this.STORAGE_KEY, theme);
    }

    /**
     * 테마를 적용합니다.
     */
    private applyTheme(theme: ThemeType): void {
        const isDark = this.shouldUseDarkMode(theme);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    /**
     * 다크 모드를 사용해야 하는지 확인합니다.
     */
    private shouldUseDarkMode(theme: ThemeType): boolean {
        if (theme === 'dark') {
            return true;
        } else if (theme === 'light') {
            return false;
        } else {
            // system
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }

    /**
     * 시스템 테마 변경 감지 리스너를 설정합니다.
     */
    private setupSystemThemeListener(): void {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        mediaQuery.addEventListener('change', () => {
            if (this.currentTheme === 'system') {
                this.applyTheme('system');
            }
        });
    }

    /**
     * 테마를 설정합니다.
     */
    setTheme(theme: ThemeType): void {
        this.currentTheme = theme;
        this.saveTheme(theme);
        this.applyTheme(theme);
    }

    /**
     * 현재 테마를 반환합니다.
     */
    getTheme(): ThemeType {
        return this.currentTheme;
    }

    /**
     * 테마를 토글합니다 (light ↔ dark).
     */
    toggleTheme(): void {
        const newTheme = this.shouldUseDarkMode(this.currentTheme) ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    /**
     * 현재 다크 모드인지 확인합니다.
     */
    isDarkMode(): boolean {
        return this.shouldUseDarkMode(this.currentTheme);
    }
}
