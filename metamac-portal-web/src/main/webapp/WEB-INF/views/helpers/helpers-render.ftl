[#ftl strip_whitespace=true]

[#--
 * messageEscape indicating escape text  (default = false)
 *
 * Macro to translate a message code with arguments into a message.
 --]
[#macro messageEscape code, escape=false][#assign args = [] /]${springMacroRequestContext.getMessage(code, args, '', escape)}[/#macro]

[#--
 * Output a bind value
 *
 --]
[#macro outputText value]
    [@spring.bind value /]
${spring.stringStatusValue}
[/#macro]

[#macro locale]${springMacroRequestContext.locale}[/#macro]

[#macro resource path]${contextPath}/theme/${applicationVersion}/${path}[/#macro]

[#macro js path]<script type="text/javascript" src="[@resource path /]"></script>[/#macro]

[#macro css path]<link rel="stylesheet" href="[@resource path /]" type="text/css"/>[/#macro]
