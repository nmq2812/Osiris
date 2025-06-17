package backend.osiris.config.security;

import backend.osiris.constant.SecurityConstants;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
@Order(1000)
public class WebSecurityConfig {

    private final UserDetailsService userDetailsService;
    private final HandlerExceptionResolver resolver;
    private final AuthTokenFilter authTokenFilter;

    public WebSecurityConfig(UserDetailsService userDetailsService, @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver, AuthTokenFilter authTokenFilter) {
        this.userDetailsService = userDetailsService;
        this.resolver = resolver;
        this.authTokenFilter = authTokenFilter;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, exception) -> resolver.resolveException(request, response, null, exception);
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, exception) -> resolver.resolveException(request, response, null, exception);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exceptionHandling -> {
                    exceptionHandling.authenticationEntryPoint(authenticationEntryPoint());
                    exceptionHandling.accessDeniedHandler(accessDeniedHandler());
                })
                .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("swagger-ui/**", "v3/api-docs/**").permitAll()
                        .requestMatchers(SecurityConstants.IGNORING_API_PATHS).permitAll()
                        .requestMatchers(SecurityConstants.ADMIN_API_PATHS).hasAnyAuthority(SecurityConstants.Role.ADMIN, SecurityConstants.Role.EMPLOYEE)
                        .requestMatchers(SecurityConstants.CLIENT_API_PATHS).hasAuthority(SecurityConstants.Role.CUSTOMER)
                        .requestMatchers("/**").permitAll()
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}