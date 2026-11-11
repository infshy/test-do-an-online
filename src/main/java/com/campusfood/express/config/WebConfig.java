package com.campusfood.express.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Chuyển hướng "/" trực tiếp về file static "/index.html"
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Đảm bảo các tài nguyên tĩnh (HTML, CSS, JS, ảnh) trong thư mục static được phục vụ chính xác
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}

