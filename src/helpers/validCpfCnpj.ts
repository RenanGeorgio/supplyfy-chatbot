export function isValid(val: string) {
    val = val.trim();

    val = val.replace("-", "");
    val = val.replace(/\./g, "");
    val = val.replace("/", "");

    if (val.length === 11) {
        const cpf = val.split("");

        var v1 = 0;
        var v2 = 0;
        var aux = false;

        for (var i = 1; cpf.length > i; i++) {
            if (cpf[i - 1] !== cpf[i]) {
                aux = true;
            }
        }

        if (aux === false) {
            return false;
        }

        for (var i = 0, p = 10; cpf.length - 2 > i; i++, p--) {
            v1 += Number(cpf[i]) * p;
        }

        v1 = (v1 * 10) % 11;

        if (v1 == 10) {
            v1 = 0;
        }

        if (v1 != Number(cpf[9])) {
            return false;
        }

        for (var i = 0, p = 11; cpf.length - 1 > i; i++, p--) {
            v2 += Number(cpf[i]) * p;
        }

        v2 = (v2 * 10) % 11;

        if (v2 == 10) {
            v2 = 0;
        }

        if (v2 !== Number(cpf[10])) {
            return false;
        }

        return true;
    } else if (val.length === 14) {
        const cnpj = val.split("");

        var v1 = 0;
        var v2 = 0;
        var aux = false;

        for (var i = 1; cnpj.length > i; i++) {
            if (cnpj[i - 1] != cnpj[i]) {
                aux = true;
            }
        }

        if (aux == false) {
            return false;
        }

        for (var i = 0, p1 = 5, p2 = 13; cnpj.length - 2 > i; i++, p1--, p2--) {
            if (p1 >= 2) {
                v1 += Number(cnpj[i]) * p1;
            } else {
                v1 += Number(cnpj[i]) * p2;
            }
        }

        v1 = v1 % 11;

        if (v1 < 2) {
            v1 = 0;
        } else {
            v1 = 11 - v1;
        }

        if (v1 !== Number(cnpj[12])) {
            return false;
        }

        for (var i = 0, p1 = 6, p2 = 14; cnpj.length - 1 > i; i++, p1--, p2--) {
            if (p1 >= 2) {
                v2 += Number(cnpj[i]) * p1;
            } else {
                v2 += Number(cnpj[i]) * p2;
            }
        }

        v2 = v2 % 11;

        if (v2 < 2) {
            v2 = 0;
        } else {
            v2 = 11 - v2;
        }

        if (v2 !== Number(cnpj[13])) {
            return false;
        }

        return true;
    }
    
    return false;
}