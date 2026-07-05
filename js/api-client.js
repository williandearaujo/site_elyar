// Wrapper fino para chamadas as APIs do Google Apps Script (comentarios/depoimentos).
// Padroniza estado de loading, uma retentativa automatica antes de desistir,
// e fallback consistente em vez de alert() cru espalhado pelas paginas.
var ElyarApi = (function () {
    function request(opts) {
        var retriesLeft = typeof opts.retries === 'number' ? opts.retries : 1;

        function attempt() {
            if (typeof opts.onLoading === 'function') opts.onLoading();

            $.ajax({
                url: opts.url,
                method: opts.method || 'GET',
                data: opts.data,
                dataType: opts.dataType,
                cache: false
            }).done(function (response) {
                if (typeof opts.onSuccess === 'function') opts.onSuccess(response);
            }).fail(function () {
                if (retriesLeft > 0) {
                    retriesLeft -= 1;
                    attempt();
                } else if (typeof opts.onError === 'function') {
                    opts.onError();
                }
            });
        }

        attempt();
    }

    return { request: request };
})();
