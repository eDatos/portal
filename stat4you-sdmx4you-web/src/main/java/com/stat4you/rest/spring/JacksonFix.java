package com.stat4you.rest.spring;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonHttpMessageConverter;
import org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter;

public class JacksonFix {

//    private static byte[]                  NULL                           = new byte[]{};

    @Autowired
    private AnnotationMethodHandlerAdapter annotationMethodHandlerAdapter = null;

    public AnnotationMethodHandlerAdapter getAnnotationMethodHandlerAdapter() {
        return annotationMethodHandlerAdapter;
    }

    public void setAnnotationMethodHandlerAdapter(AnnotationMethodHandlerAdapter annotationMethodHandlerAdapter) {
        this.annotationMethodHandlerAdapter = annotationMethodHandlerAdapter;
    }

    @PostConstruct
    public void init() {
        HttpMessageConverter<?>[] messageConverters = annotationMethodHandlerAdapter.getMessageConverters();
        for (HttpMessageConverter<?> messageConverter : messageConverters) {
            if (messageConverter instanceof MappingJacksonHttpMessageConverter) {
                MappingJacksonHttpMessageConverter m = (MappingJacksonHttpMessageConverter) messageConverter;
                ObjectMapper objectMapper = new ObjectMapper() {
                    @Override
                    public void writeValue(JsonGenerator jgen, Object value) throws IOException, JsonGenerationException, JsonMappingException {
                        SerializationConfig cfg = copySerializationConfig(); // ALLOW SerializationConfig.Feature.INDENT_OUTPUT
                        if (cfg.isEnabled(SerializationConfig.Feature.INDENT_OUTPUT)) {
                            jgen.useDefaultPrettyPrinter();
                        }
                        super.writeValue(jgen, value);
                    }
                };
                // objectMapper.getJsonFactory().getpgetouconfigure(org.codehaus.jackson.JsonGenerator.Feature., state)

                objectMapper.configure(SerializationConfig.Feature.INDENT_OUTPUT, true);

//                objectMapper.getSerializerProvider().setNullValueSerializer(new JsonSerializer<Object>() {
//                    @Override
//                    public void serialize(Object value, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonProcessingException {
//                        jgen.writeBinary(NULL); // NOTHING
//                    }
//                });
                m.setObjectMapper(objectMapper);
            }
        }
    }

}
