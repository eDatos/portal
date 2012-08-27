package com.stat4you.web;

import com.stat4you.common.configuration.ConfigurationHelper;

public class Stat4youConfiguration {

	private static Stat4youConfiguration INSTANCE = new Stat4youConfiguration();

	private ConfigurationHelper configurationHelper = null;

	private Stat4youConfiguration() {
		configurationHelper = new ConfigurationHelper();
	}

	public static Stat4youConfiguration getInstance() {
		return INSTANCE;
	}

	public String getPropertyString(String key) {
		return configurationHelper.getConfig().getString(key);
	}
}
