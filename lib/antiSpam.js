const cooldown = new Map();

module.exports = {
    check(sender, cooldownTime = 2000) {
        if (cooldown.has(sender)) {
            if (Date.now() - cooldown.get(sender) < cooldownTime) {
                return true;
            }
        }
        cooldown.set(sender, Date.now());
        return false;
    }
};