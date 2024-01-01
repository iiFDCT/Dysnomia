"use strict";

const Base = require("./Base");
const Endpoints = require("../rest/Endpoints");
const User = require("./User");

/**
* Represents an emoji
* @extends Base
*/
class Emoji extends Base {
    /**
     * The ID of the emoji
     * @member {String} Emoji#id
     */
    /**
     * Timestamp of the emoji's creation
     * @member {String} Emoji#createdAt
     */
    /**
     * User that created this emoji
     * @member {User?} Emoji#user
     */
    constructor(data, guild, client) {
        super(data.id);

        if(guild) {
            this.guild = guild;

            if(data.user !== undefined) {
                this.user = this.guild.shard.client.users.update(data.user, client);
            }
        } else if(data.user) {
            this.user = client.users.update(data.user, client);
        }

        this.update(data);
    }

    update(data) {
        if(data.name !== undefined) {
            /**
             * The name of the emoji
             * @type {String}
             */
            this.name = data.name;
        }
        if(data.roles !== undefined) {
            /**
             * Array of roles allowed to use this emoji
             * @type {Array<String>?}
             */
            this.roles = data.roles;
        }
        if(data.require_colons !== undefined) {
            /**
             * Whether this emoji must be wrapped in colons
             * @type {Boolean?}
             */
            this.require_colons = data.require_colons;
        }
        if(data.managed !== undefined) {
            /**
             * Whether a guild integration manages this emoji or not
             * @type {Boolean?}
             */
            this.managed = data.managed;
        }
        if(data.animated !== undefined) {
            /**
             * Whether this emoji is animated
             * @type {Boolean?}
             */
            this.animated = data.animated;
        }
        if(data.available !== undefined) {
            /**
             * Whether this emoji can be used, may be false due to loss of Server Boosts
             * @type {Boolean?}
             */
            this.available = data.available;
        }
    }

    /**
     * A string that you can use to format the emoji on Discord
     * @type {String}
     */
    get format() {
        return `<${this.animated ? "a" : ""}:${this.name}:${this.id}>`;
    }

    /**
     * The URL of the emoji
     * @type {String}
     */
    get url() {
        return `${Endpoints.CDN_URL}${Endpoints.CUSTOM_EMOJI(this.id)}.${this.animated ? "gif" : "png"}`;
    }

    /**
    * Delete a guild emoji
    * @arg {String} [reason] The reason to be displayed in audit logs
    * @returns {Promise}
    */
    delete(reason) {
        return this.guild.shard.client.deleteGuildEmoji.call(this.guild.shard.client, this.guild.id, this.id, reason);
    }

    /**
    * Edit a guild emoji
    * @arg {Object} options Emoji options
    * @arg {String} [options.name] The name of emoji
    * @arg {Array} [options.roles] An array containing authorized role IDs
    * @arg {String} [reason] The reason to be displayed in audit logs
    * @returns {Promise<Emoji>}
    */
    edit(options, reason) {
        return this.guild.shard.client.editGuildEmoji.call(this.guild.shard.client, this.guild.id, this.id, options, reason);
    }

    toJSON(props = []) {
        return super.toJSON([
            "name",
            "roles",
            "user",
            "require_colons",
            "managed",
            "animated",
            "available",
            ...props
        ]);
    }
}

module.exports = Emoji;