function generateGoogleLink(tab) {

    const url = tab.url
    const data = url.split("?")[1].split("&")
    const lat = data[0].split("=")[1]
    const lng = data[1].split("=")[1]
    const zoom = data[2].split("=")[1]

    const googleLink = `https://www.google.com/maps/@${lat},${lng},${zoom}z`

    return googleLink
}

function generateShadowmapLinkFromGoogleMaps(tab) {

    const url = tab.url
    const parameters = url.split(',')
    const lngLat = /\/\@(.*),(.*),/.exec(url);
   

    let lat = lngLat[1]
    let lng = lngLat[2]

    // catch google street view url by checking if lngLat[1] has a comma in it
    if(lngLat[1] && lngLat[1].includes(",")) {
        const streetViewLngLat = lngLat[1].split(",")

        lat = streetViewLngLat[0]
        lng = streetViewLngLat[1]
    }

    var zoomLevel = 15

    for (const parameter of parameters) {
        if (parameter.slice(-1) === 'z') {
            const zoom = parseInt(parameter.replace('z', ''))
            zoomLevel = Math.min(Math.max(zoom, 3), 18)
            break
        } 
    }

    return `https://app.shadowmap.org/?lat=${lat}&lng=${lng}&zoom=${zoomLevel}`

}

function generateShadowmapLinkFromGoogleEarth(tab) {

    const url = tab.url
    const lngLat = /\/\@(.*),(.*),/.exec(url);
    const extractLatLng = lngLat[1].split(',')
    const zoomLevel = 15

    lat = extractLatLng[0]
    lng = extractLatLng[1]

    return `https://app.shadowmap.org/?lat=${lat}&lng=${lng}&zoom=${zoomLevel}`
}


browser.browserAction.onClicked.addListener(function(tab) {

    const tabURL = tab.url

    if(!tabURL.includes("app.shadowmap") && !tabURL.includes("google")) {
        chrome.tabs.create("https://app.shadowmap.org/");
        return
    }

    if (tabURL.includes("app.shadowmap")) {
        const url = generateGoogleLink(tab)
        chrome.tabs.create({ url });
        return
    }
    
    if (tabURL.includes("google") && (tabURL.includes("/maps/"))) {
        const url = generateShadowmapLinkFromGoogleMaps(tab);
        chrome.tabs.create({ url });
        return
    }
    
    if (tabURL.includes("google") &&  tabURL.includes("earth")) {
        const url = generateShadowmapLinkFromGoogleEarth(tab);
        chrome.tabs.create({ url });
        return
    }

})
