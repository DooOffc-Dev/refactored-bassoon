/**
 * DooHIGH - Fake Forward / Channel Effect
 * Format PERSIS kaya di foto: 
 * Diteruskan
 * AL STORY
 * WhatsApp ✓✓ Status
 */

function createForwardContext(config) {
    if (!config.fakeForwardEnabled) return {};
    
    let contextInfo = {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: config.fakeForwardId,
            newsletterName: config.fakeForwardName,
            serverMessageId: Date.now().toString()
        }
    };
    
    if (config.showBlueCheck) {
        contextInfo.forwardedNewsletterMessageInfo.newsletterVerified = true;
        contextInfo.forwardedNewsletterMessageInfo.verifiedLevel = 'high';
        contextInfo.forwardedNewsletterMessageInfo.verifiedType = 'official';
    }
    
    if (config.showWhatsAppMeta) {
        contextInfo.forwardedNewsletterMessageInfo.metaInfo = {
            platform: 'WhatsApp',
            type: 'Status',
            isVerified: config.showBlueCheck,
            version: '2.24.0'
        };
    }
    
    if (config.fakeForwardType === 'status') {
        contextInfo = {
            ...contextInfo,
            isStatusMessage: true,
            statusMetadata: {
                platform: 'WhatsApp',
                contentType: 'Status',
                senderName: config.fakeForwardName,
                isVerified: config.showBlueCheck,
                verifiedPosition: 'middle'
            }
        };
    }
    
    return contextInfo;
}

function createWhatsAppStatusMessage(imageUrl, title, content, config) {
    let headerText = `📱 *Diteruskan*\n*${config.fakeForwardName}*\n\n`;
    
    if (config.showBlueCheck) {
        headerText += `WhatsApp ✓✓ · Status\n\n`;
    } else {
        headerText += `WhatsApp · Status\n\n`;
    }
    
    return {
        image: { url: imageUrl },
        caption: headerText + content,
        contextInfo: createForwardContext(config)
    };
}

function createForwardedMessage(message, config) {
    let headerText = `📱 *Diteruskan*\n*${config.fakeForwardName}*\n\n`;
    
    if (config.showBlueCheck) {
        headerText += `WhatsApp ✓✓ · Status\n\n`;
    } else {
        headerText += `WhatsApp · Status\n\n`;
    }
    
    return {
        text: headerText + message,
        contextInfo: createForwardContext(config)
    };
}

function createForwardedMedia(mediaUrl, caption, config) {
    let headerText = `📱 *Diteruskan*\n*${config.fakeForwardName}*\n\n`;
    
    if (config.showBlueCheck) {
        headerText += `WhatsApp ✓✓ · Status\n\n`;
    } else {
        headerText += `WhatsApp · Status\n\n`;
    }
    
    return {
        image: { url: mediaUrl },
        caption: headerText + caption,
        contextInfo: createForwardContext(config)
    };
}

function createForwardedAudio(audioUrl, config) {
    return {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        ptt: true,
        contextInfo: createForwardContext(config)
    };
}

function createStatusMessage(imageUrl, title, content, config) {
    return createWhatsAppStatusMessage(imageUrl, title, content, config);
}

module.exports = {
    createForwardContext,
    createForwardedMessage,
    createForwardedMedia,
    createForwardedAudio,
    createStatusMessage,
    createWhatsAppStatusMessage
};