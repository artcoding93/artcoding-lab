# artcoding Lab · 수치해석 Lecture 01 「수치해석이란 무엇인가?」 1.6.2 Python 구현
# 이분법(Bisection Method)으로 x^3 - x - 2 = 0의 근을 구한다. 실행: python3 introduction-bisection.py


def f(x):
    return x**3 - x - 2


def bisection(a, b, tol=1e-8, max_iter=100):
    fa = f(a)
    fb = f(b)

    if fa * fb > 0:
        raise ValueError("양 끝점의 함수값은 부호가 달라야 합니다.")

    if fa == 0:
        return a
    if fb == 0:
        return b

    for i in range(max_iter):
        m = (a + b) / 2
        fm = f(m)

        if fm == 0 or (b - a) / 2 <= tol:
            return m

        if fa * fm < 0:
            b = m
        else:
            a = m
            fa = fm

    raise RuntimeError("허용오차에 도달하지 못했습니다.")


root = bisection(1.0, 2.0)

print(f"근사해: {root:.10f}")
print(f"함숫값: {f(root):.3e}")
