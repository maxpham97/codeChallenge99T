function sum_to_n_a(n: number) {
    return (n * (n + 1)) / 2;
}

function sum_to_n_b(n: number) {
    if (n <= 1) return n;

    return n + sum_to_n_b(n - 1);
}

function sum_to_n_c(n: number) {
    let sum = 0;

    for (let i = 0; i <= n; i++) {
        sum += i;
    }
    return sum;
}
