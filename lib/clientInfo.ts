// lib/clientInfo.ts
interface ClientInfo {
    browser: {
        name: string | null;
        version: string | null;
    };
    os: string | null;
}

interface UABrand {
    brand: string;
    version: string;
}

export const getClientInfo = async (): Promise<ClientInfo> => {
    const info: any = {
        uaString: navigator.userAgent || '',
        platform: navigator.platform || '',
        browser: { name: null, version: null },
        os: null,
    };

    // API Moderne : User-Agent Client Hints
    // @ts-ignore
    if (navigator.userAgentData) {
        try {
            // @ts-ignore
            const uaData = navigator.userAgentData;
            const brands = uaData.brands || [];
            if (brands.length > 0) {
                // Essayer de trouver la marque principale (ex: "Google Chrome" au lieu de "Chromium")
                const mainBrand = brands.find((b: UABrand) => !b.brand.includes('Not') && !b.brand.includes('Chromium'));
                if (mainBrand) {
                    info.browser.name = mainBrand.brand;
                } else if (brands[brands.length - 1]) { // Fallback sur la dernière marque significative
                    info.browser.name = brands[brands.length - 1].brand;
                }
            }
            
            // @ts-ignore
            const highEntropyValues = await uaData.getHighEntropyValues(['platformVersion', 'fullVersionList']);
            if (highEntropyValues.fullVersionList && highEntropyValues.fullVersionList.length > 0) {
                 const mainBrandVersion = highEntropyValues.fullVersionList.find((b: UABrand) => b.brand === info.browser.name);
                 if (mainBrandVersion) {
                    info.browser.version = mainBrandVersion.version;
                }
            }

            info.os = uaData.platform || info.platform;

        } catch (e) {
            console.warn('Impossible d\'obtenir les User Agent Client Hints:', e);
        }
    }

    // Fallback : Analyse de la chaîne userAgent
    if (!info.browser.name || !info.browser.version || !info.os) {
        const ua = info.uaString.toLowerCase();
        
        const oses = [
            { name: 'Windows 10/11', match: /windows nt 10/ },
            { name: 'Windows 8.1', match: /windows nt 6.3/ },
            { name: 'Windows 7', match: /windows nt 6.1/ },
            { name: 'macOS', match: /mac os x/ },
            { name: 'Android', match: /android/ },
            { name: 'iOS', match: /iphone|ipad|ipod/ },
            { name: 'Linux', match: /linux/ }
        ];
        for(const o of oses){
            if(o.match.test(ua)) { info.os = o.name; break; }
        }

        const browsers = [
            { name: 'Edge', match: /edg\/([\d.]+)/ },
            { name: 'Chrome', match: /chrome\/([\d.]+)/ },
            { name: 'Firefox', match: /firefox\/([\d.]+)/ },
            { name: 'Safari', match: /version\/([\d.]+).*safari/ },
            { name: 'Opera', match: /opr\/([\d.]+)/ },
        ];
        for (const b of browsers) {
            const m = ua.match(b.match);
            if (m) { 
                info.browser.name = b.name; 
                info.browser.version = m[1]; 
                break; 
            }
        }
    }

    return {
        browser: info.browser,
        os: info.os || 'Inconnu'
    };
};