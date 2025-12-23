/**
 * 숫자 및 수식 포맷팅 유틸리티 클래스
 */
export class Formatter {
    /**
     * 숫자에 천 단위 구분 기호를 추가합니다.
     * @param value 포맷할 숫자 문자열
     * @returns 천 단위 구분 기호가 추가된 문자열
     */
    static formatNumber(value: string): string {
        if (!value || value === '') return value;

        // 숫자가 아닌 경우 그대로 반환
        if (isNaN(Number(value))) return value;

        const parts = value.split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1];

        // 음수 처리
        const isNegative = integerPart.startsWith('-');
        const absoluteInteger = isNegative ? integerPart.slice(1) : integerPart;

        // 천 단위 구분 기호 추가
        const formattedInteger = absoluteInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // 음수 기호 복원
        const result = isNegative ? '-' + formattedInteger : formattedInteger;

        // 소수점 부분이 있으면 추가
        return decimalPart !== undefined ? `${result}.${decimalPart}` : result;
    }

    /**
     * 소수점 자릿수를 제한합니다.
     * @param value 포맷할 숫자 문자열
     * @param maxDecimals 최대 소수점 자릿수 (기본값: 10)
     * @returns 소수점이 제한된 문자열
     */
    static formatDecimal(value: string, maxDecimals: number = 10): string {
        const num = parseFloat(value);

        if (isNaN(num)) return value;

        // 정수인 경우 그대로 반환
        if (Number.isInteger(num)) return value;

        // 소수점 자릿수 제한 및 반올림
        return num.toFixed(maxDecimals).replace(/\.?0+$/, '');
    }

    /**
     * 불필요한 뒷자리 0을 제거합니다.
     * @param value 처리할 숫자 문자열
     * @returns 불필요한 0이 제거된 문자열
     */
    static removeTrailingZeros(value: string): string {
        if (!value.includes('.')) return value;

        // 뒷자리 0 제거 후 소수점만 남은 경우도 제거
        return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    }

    /**
     * 계산 결과를 포맷팅합니다.
     * - 천 단위 구분 기호 추가
     * - 불필요한 뒷자리 0 제거
     * - 소수점 자릿수 제한
     * - 과학적 표기법 처리
     * @param value 포맷할 결과 문자열
     * @returns 포맷팅된 결과 문자열
     */
    static formatResult(value: string): string {
        // 특수 값 처리
        if (value === 'Infinity' || value === '-Infinity') return value;
        if (value === 'NaN') return 'Error';

        const num = parseFloat(value);

        if (isNaN(num)) return value;

        // 매우 작은 숫자는 과학적 표기법 사용
        if (Math.abs(num) < 0.000001 && num !== 0) {
            return num.toExponential(6);
        }

        // 매우 큰 숫자는 과학적 표기법 사용
        if (Math.abs(num) > 1e15) {
            return num.toExponential(6);
        }

        // 소수점 자릿수 제한
        let formatted = this.formatDecimal(num.toString(), 10);

        // 불필요한 0 제거
        formatted = this.removeTrailingZeros(formatted);

        // 천 단위 구분 기호 추가
        formatted = this.formatNumber(formatted);

        return formatted;
    }
}
