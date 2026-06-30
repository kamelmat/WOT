/*
 * Copyright 2007-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class MavenWrapperDownloader {
  private static final String WRAPPER_VERSION = "3.3.2";
  private static final String WRAPPER_JAR_URL =
      "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/" + WRAPPER_VERSION
          + "/maven-wrapper-" + WRAPPER_VERSION + ".jar";

  public static void main(String[] args) throws Exception {
    File baseDirectory = new File(args.length > 0 ? args[0] : ".");
    File wrapperJar = new File(baseDirectory, ".mvn/wrapper/maven-wrapper.jar");
    if (wrapperJar.exists()) {
      return;
    }
    wrapperJar.getParentFile().mkdirs();
    downloadFileFromURL(WRAPPER_JAR_URL, wrapperJar);
  }

  private static void downloadFileFromURL(String urlString, File destination) throws IOException {
    URL url = new URL(urlString);
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
    connection.setConnectTimeout(15000);
    connection.setReadTimeout(15000);
    connection.setRequestProperty("User-Agent", "maven-wrapper-downloader");

    try (InputStream in = connection.getInputStream();
         FileOutputStream out = new FileOutputStream(destination)) {
      byte[] buffer = new byte[8192];
      int bytesRead;
      while ((bytesRead = in.read(buffer)) != -1) {
        out.write(buffer, 0, bytesRead);
      }
    }
  }
}

