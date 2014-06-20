Ext.define("DigiCompass.ian.DefaultVersionName", {
			statics : {

				/**
				 * key,value pares to cache the default version name policy. key =
				 * moduleType, value = policy which is instance of
				 */
				POLICIES : new Object(),

				putPolicy : function(moduleType, policy) {
					this.POLICIES[moduleType] = policy;
				},

				getPolicy : function(moduleType) {
					return this.POLICIES[moduleType];
				},

				/**
				 * use the defaultVersionName policy to generate a default name
				 * 
				 * @param moduleType
				 * @param data
				 *            Object data use to find its property
				 * @param versionElement
				 * @return generated version name, or "" if no policy found.
				 */
				generate : function(moduleType, data, versionElement) {
					// @DefaultVersionName(expr = "{}_{}_{}_{}", properties = {
					// "siteGroup","technology","planningCycle",
					// DefaultVersionName.SYS_DATE})
					var policy = this.getPolicy(moduleType);
					if (!policy) {
						this.retrivePolicy(moduleType, data, versionElement);
						return;
					}
					this._generate_(moduleType, data, versionElement);
				},

				_generate_ : function(moduleType, data, versionElement) {
					var policy = this.getPolicy(moduleType);
					var name = policy["expr"];
					var properties = policy["properties"];
					for (var i = 0; i < properties.length; i++) {
						var property = properties[i];
						var value;
						if (property == "SYS_DATE")
							value = Ext.Date.format(new Date(), "Y-m-d H:i:s");
						else
							value = data[property];
						if (!value)
							value = "";
						name = name.replace("{}", value);
					}
					versionElement.setValue(name);
				},

				/**
				 * retive defaulterVersionName policy of moduleType.
				 * 
				 * @param moduleType
				 * @return void
				 */
				retrivePolicy : function(moduleType, data, versionElement) {
					cometdfn.registFn({
								MODULE_TYPE : moduleType,
								COMMAND : 'COMMAND_DEFAULT_VERSION_NAME',
								Conf : data,
								callbackfn : function(data, conf) {
									DigiCompass.ian.DefaultVersionName
											.putPolicy(data.MODULE_TYPE,
													data.BUSINESS_DATA);
									DigiCompass.ian.DefaultVersionName
											._generate_(moduleType, conf,
													versionElement);
								}
							});

					cometdfn.publish({
								MODULE_TYPE : moduleType,
								COMMAND : 'COMMAND_DEFAULT_VERSION_NAME'
							});
				}
			}
		});