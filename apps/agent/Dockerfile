FROM golang:1.24-alpine AS tatar
RUN apk add --no-cache git
RUN GOBIN=/out go install github.com/ochmunkh/tatar-kuber/cmd/tatar-kuber@v1.0.3

FROM python:3.13-alpine
WORKDIR /agent
COPY --from=tatar /out/tatar-kuber /usr/local/bin/tatar-kuber
COPY agent.py .
USER 65532:65532
ENTRYPOINT ["python","agent.py"]
