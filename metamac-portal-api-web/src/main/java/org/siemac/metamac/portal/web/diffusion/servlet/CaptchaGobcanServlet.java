package org.siemac.metamac.portal.web.diffusion.servlet;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import https.www_gobiernodecanarias_org.ws.wscaptcha.service_asmx.CaptchaService;
import https.www_gobiernodecanarias_org.ws.wscaptcha.service_asmx.CaptchaServiceSoap;
import nl.captcha.servlet.CaptchaServletUtil;

public class CaptchaGobcanServlet extends HttpServlet {

    private static final long serialVersionUID = -7975028803772796638L;

    private static final Logger log = LoggerFactory.getLogger(CaptchaGobcanServlet.class);

    public static String CAPTCHA_GOBCAN_NAME = "captcha_gobcan";

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String imageFormat = "jpg";
        response.setContentType("image/" + imageFormat);

        try {
            // Se pueden pasar como par&aacute;ros el ancho/largo
            // que tendr&iacute;a imagen.

            // Tiempo de expiraci&oacute; en segundos
            // Por defecto el ancho ser&aacute; 300 y el alto 100
            int width = paramInt(request, "width", 300);
            int height = paramInt(request, "height", 100);

            String numeros = "0123456789";
            String operaciones = "+-*";
            char[] mapnum = numeros.toCharArray();
            char[] mapop = operaciones.toCharArray();

            // contenido del catpcha
            String keyword = "";
            int resultado = 0;

            // Primer operando
            double randomValue = Math.random();
            int randomIndex = (int) Math.round(randomValue * (mapnum.length - 1));
            char op1 = mapnum[randomIndex];
            int operando1 = Integer.parseInt(String.valueOf(op1));

            // Segundo operando
            randomValue = Math.random();
            randomIndex = (int) Math.round(randomValue * (mapnum.length - 1));
            char op2 = mapnum[randomIndex];
            int operando2 = Integer.parseInt(String.valueOf(op2));

            // operaci&oacute;
            randomValue = Math.random();
            randomIndex = (int) Math.round(randomValue * (mapop.length - 1));
            char operacion = mapop[randomIndex];
            String op = Character.toString(operacion);
            if (op.equals("+")) {
                resultado = operando1 + operando2;
                keyword = op1 + " m\u00e1s " + op2;
            } else if (op.equals("-")) {
                if (operando1 < operando2) {
                    resultado = operando2 - operando1;
                    keyword = op2 + " menos " + op1;
                } else {
                    resultado = operando1 - operando2;
                    keyword = op1 + " menos " + op2;
                }
            } else if (op.equals("*")) {
                resultado = operando1 * operando2;
                keyword = op1 + " por " + op2;
            }

            String fontname = "Arial Narrow";

            //
            // Llamo al servicio web, la ruta del mismo se tendr&aacute;
            // que adaptar a cada desarrollo

            // *****************************************************
            // only development
            // proxyLocal();
            // *****************************************************

            URL wsdlLocation = getClass().getResource("/wsdl/captcha-gobcan.wsdl");
            CaptchaService service = new CaptchaService(wsdlLocation);
            CaptchaServiceSoap CaptchaServ = service.getCaptchaServiceSoap();

            byte[] imgCaptcha = CaptchaServ.captchaImage1(width, height, keyword.toString(), fontname.toString(), 45f);

            InputStream memStream = new ByteArrayInputStream(imgCaptcha);

            BufferedImage bufferedImage = ImageIO.read(memStream);

            log.info("Setting {} (answer: {}) to session {}", new Object[]{CAPTCHA_GOBCAN_NAME, String.valueOf(resultado), request.getSession().getId()});
            request.getSession().setAttribute("captcha_gobcan", String.valueOf(resultado));
            // Escribir la imagen como un jpg
            CaptchaServletUtil.writeImage(response, bufferedImage);
        } catch (Exception e) {
            log.error("No se pudo construir el CAPTCHA", e);
            throw new RuntimeException("No se pudo construir el CAPTCHA", e);
        }
    }

    protected void proxyLocal() {
        System.setProperty("https.proxyHost", "proxy-vpn.gobiernodecanarias.net");
        System.setProperty("https.proxyPort", "8213");
    }

    private int paramInt(HttpServletRequest request, String paramName, int defaultInt) {
        return request.getParameter(paramName) != null ? Integer.parseInt(request.getParameter(paramName)) : defaultInt;
    }
}
