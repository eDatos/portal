package org.siemac.metamac.portal.web.diffusion.servlet;

import static nl.captcha.Captcha.NAME;

import java.awt.Color;
import java.awt.Font;
import java.io.IOException;
import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import nl.captcha.Captcha;
import nl.captcha.servlet.CaptchaServletUtil;

/**
 * Generates, displays, and stores in session a 200x50 CAPTCHA image with sheared
 * black text, a solid dark grey background, and a slightly curved line over the
 * text.
 * 
 * @author <a href="mailto:james.childers@gmail.com">James Childers</a>
 */
public class SimpleCaptchaServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private static final List<Color> COLORS = new ArrayList<Color>(2);
    private static final List<Font> FONTS = new ArrayList<Font>(3);

    private static int _width = 200;
    private static int _height = 50;

    static {
        COLORS.add(Color.BLACK);
        COLORS.add(Color.BLUE);

        FONTS.add(new Font("Geneva", Font.ITALIC, 48));
        FONTS.add(new Font("Courier", Font.BOLD, 48));
        FONTS.add(new Font("Arial", Font.BOLD, 48));
    }

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        if (getInitParameter("captcha-height") != null) {
            _height = Integer.valueOf(getInitParameter("captcha-height"));
        }

        if (getInitParameter("captcha-width") != null) {
            _width = Integer.valueOf(getInitParameter("captcha-width"));
        }
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Captcha captcha = new Captcha.Builder(_width, _height).addText().addBackground().addNoise().gimp().addBorder().build();

        log.info("Setting {} (answer: {}) to session {}", new Object[]{NAME, captcha.getAnswer(), req.getSession().getId()});
        req.getSession().setAttribute(NAME, captcha);
        CaptchaServletUtil.writeImage(resp, captcha.getImage());
    }
}